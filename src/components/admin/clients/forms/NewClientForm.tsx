import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { ClientCreateInput, TaxCondition, DocumentType } from "@/types/client";
import { useClientStore } from "@/store/useClient";
import { z } from "zod";

const clientFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  cuit: z.string().min(11, "El CUIT debe tener al menos 11 caracteres"),
  taxCondition: z.string().min(1, "La condición fiscal es requerida"),
  documentType: z.string().min(1, "El tipo de documento es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface FormProps {
  onSuccess?: () => void;
}

export function NewClientForm({ onSuccess }: FormProps) {
  const { createClient, loading } = useClientStore();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      cuit: "",
      taxCondition: "",
      documentType: "",
      address: "",
      phone: "",
    },
  });

  async function onSubmit(values: ClientFormData) {
    try {
      const clientData: ClientCreateInput = {
        name: values.name,
        cuit: values.cuit,
        taxCondition: values.taxCondition as TaxCondition,
        documentType: values.documentType as DocumentType,
        address: values.address,
        phone: values.phone,
      };

      await createClient(clientData);
      
      // Reset form after successful creation
      form.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre del Cliente */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CUIT */}
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
          {/* Condición Fiscal */}
          <FormField
            control={form.control}
            name="taxCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición Fiscal</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar condición</option>
                    <option value="Responsable Inscripto">Responsable Inscripto</option>
                    <option value="Monotributo">Monotributo</option>
                    <option value="Consumidor Final">Consumidor Final</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Documento */}
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="DNI">DNI</option>
                    <option value="CUIT">CUIT</option>
                    <option value="CUIL">CUIL</option>
                    <option value="Passport">Passport</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dirección */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección completa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono (opcional) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón submit */}
        <div className="submit-button">
          <Button type="submit" disabled={loading} className="w-full mt-5">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cliente...
              </>
            ) : (
              "Crear cliente"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
