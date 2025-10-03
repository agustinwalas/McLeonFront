import { z } from "zod";

export const supplierInvoiceFormSchema = z.object({
  supplierId: z.string().min(1, "El proveedor es requerido"),
  businessName: z.string().min(1, "La razón social es requerida").max(200, "La razón social no puede exceder 200 caracteres"),
  invoiceNumber: z.string().min(1, "El número de factura es requerido").max(50, "El número de factura no puede exceder 50 caracteres"),
  date: z.string().min(1, "La fecha es requerida"),
  amount: z.string().min(1, "El importe es requerido").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "El importe debe ser un número mayor o igual a 0"
  ),
});

export const supplierInvoiceEditSchema = z.object({
  businessName: z.string().min(1, "La razón social es requerida").max(200, "La razón social no puede exceder 200 caracteres").optional(),
  invoiceNumber: z.string().min(1, "El número de factura es requerido").max(50, "El número de factura no puede exceder 50 caracteres").optional(),
  date: z.string().min(1, "La fecha es requerida").optional(),
  amount: z.string().min(1, "El importe es requerido").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "El importe debe ser un número mayor o igual a 0"
  ).optional(),
});

export type SupplierInvoiceFormData = z.infer<typeof supplierInvoiceFormSchema>;
export type SupplierInvoiceEditData = z.infer<typeof supplierInvoiceEditSchema>;