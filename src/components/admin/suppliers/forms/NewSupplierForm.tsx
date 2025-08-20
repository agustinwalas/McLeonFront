import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supplierFormSchema, SupplierFormData } from "./schemas/supplierSchema";
import { useSupplierStore } from "@/store/useSupplier";

interface FormProps {
  onSuccess?: () => void;
}

export const NewSupplierForm = ({ onSuccess }: FormProps) => {
  const { createSupplier, loading } = useSupplierStore();
  
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await createSupplier({
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location,
        suppliedProducts: [],
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error al crear proveedor:", error);
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
                <Input placeholder="Ingresá el nombre del proveedor" {...field} />
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
                <Input placeholder="Ingresá el teléfono" {...field} />
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
                <Input type="email" placeholder="Ingresá el email" {...field} />
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
                <Input placeholder="Ingresá la ubicación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Creando..." : "Crear proveedor"}
        </Button>
      </form>
    </Form>
  );
};
