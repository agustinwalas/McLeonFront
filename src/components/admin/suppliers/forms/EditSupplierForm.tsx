import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupplierStore } from "@/store/useSupplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supplierEditSchema, SupplierEditData } from "./schemas/supplierSchema";
import { ISupplier } from "@/types";

interface EditSupplierFormProps {
  supplier: ISupplier;
  onSuccess: () => void;
}

export const EditSupplierForm = ({ supplier, onSuccess }: EditSupplierFormProps) => {
  const { updateSupplier, loading } = useSupplierStore();
  
  const form = useForm<SupplierEditData>({
    resolver: zodResolver(supplierEditSchema),
    defaultValues: {
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      location: supplier.location || "",
    },
  });

  const onSubmit = async (data: SupplierEditData) => {
    try {
      await updateSupplier(supplier._id, {
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location || "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Teléfono del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ubicación del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar proveedor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
