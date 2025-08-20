import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientStore } from "@/store/useClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IClient, TaxCondition, DocumentType } from "@/types/client";
import { z } from "zod";

const clientEditSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  cuit: z.string().min(11, "El CUIT debe tener al menos 11 caracteres"),
  taxCondition: z.string().min(1, "La condición fiscal es requerida"),
  documentType: z.string().min(1, "El tipo de documento es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof clientEditSchema>;

interface EditClientFormProps {
  client: IClient;
  onSuccess: () => void;
}

export const EditClientForm = ({ client, onSuccess }: EditClientFormProps) => {
  const { updateClient, loading } = useClientStore();
  
  const form = useForm<FormData>({
    resolver: zodResolver(clientEditSchema),
    defaultValues: {
      name: client.name,
      cuit: client.cuit,
      taxCondition: client.taxCondition,
      documentType: client.documentType,
      address: client.address,
      phone: client.phone || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateClient(client._id, {
        name: data.name,
        cuit: data.cuit,
        taxCondition: data.taxCondition as TaxCondition,
        documentType: data.documentType as DocumentType,
        address: data.address,
        phone: data.phone,
      });
      onSuccess();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
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
              <FormLabel>Nombre del cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CUIT</FormLabel>
              <FormControl>
                <Input placeholder="XX-XXXXXXXX-X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taxCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición Fiscal</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Responsable Inscripto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: CUIT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección del cliente" {...field} />
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
              <FormLabel>Teléfono (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Teléfono del cliente" {...field} />
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
            {loading ? "Actualizando..." : "Actualizar cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
