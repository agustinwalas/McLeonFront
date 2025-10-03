import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supplierInvoiceFormSchema, SupplierInvoiceFormData } from "./schemas/supplierInvoiceSchema";
import { useSupplierInvoiceStore } from "@/store/useSupplierInvoice";
import { useSupplierStore } from "@/store/useSupplier";
import { useEffect } from "react";

interface FormProps {
  onSuccess?: () => void;
}

export const NewSupplierInvoiceForm = ({ onSuccess }: FormProps) => {
  const { createInvoice, loading } = useSupplierInvoiceStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const form = useForm<SupplierInvoiceFormData>({
    resolver: zodResolver(supplierInvoiceFormSchema),
    defaultValues: {
      supplierId: "",
      businessName: "",
      invoiceNumber: "",
      date: getTodayDate(),
      amount: "",
    },
  });

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Cuando se selecciona un proveedor, auto-completar la razón social
  const handleSupplierChange = (supplierId: string) => {
    const selectedSupplier = suppliers.find(s => s._id === supplierId);
    if (selectedSupplier && selectedSupplier.razonSocial) {
      form.setValue("businessName", selectedSupplier.razonSocial);
    }
  };

  const onSubmit = async (data: SupplierInvoiceFormData) => {
    try {
      await createInvoice({
        supplierId: data.supplierId,
        businessName: data.businessName,
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        amount: parseFloat(data.amount),
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error al crear factura:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleSupplierChange(e.target.value);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>Seleccioná un proveedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Ingresá la razón social" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Factura</FormLabel>
              <FormControl>
                <Input placeholder="Ej: FAC-001-2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  max={getTodayDate()}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importe</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00" 
                  {...field} 
                />
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
          {loading ? "Creando..." : "Crear factura"}
        </Button>
      </form>
    </Form>
  );
};