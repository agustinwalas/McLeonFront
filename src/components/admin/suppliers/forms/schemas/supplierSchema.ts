import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido"),
  location: z.string().min(1, "La ubicación es requerida"),
  razonSocial: z.string().min(1, "La razón social es requerida").max(200, "La razón social no puede exceder 200 caracteres"),
});

export const supplierEditSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido"),
  location: z.string().optional(),
  razonSocial: z.string().min(1, "La razón social es requerida").max(200, "La razón social no puede exceder 200 caracteres").optional(),
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
export type SupplierEditData = z.infer<typeof supplierEditSchema>;
