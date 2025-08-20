import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido"),
  location: z.string().min(1, "La ubicación es requerida"),
});

export const supplierEditSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido"),
  location: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
export type SupplierEditData = z.infer<typeof supplierEditSchema>;
