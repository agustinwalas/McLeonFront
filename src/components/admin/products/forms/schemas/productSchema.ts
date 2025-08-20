import { z } from "zod";

export const productFormSchema = z.object({
  productCode: z.string().min(1, { message: "El código es obligatorio." }),
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  category: z.string().min(1, { message: "La categoría es obligatoria." }),
  wholesalePrice: z.coerce
    .number()
    .min(0, { message: "El precio mayorista debe ser un número positivo." }),
  retailPrice: z.coerce
    .number()
    .min(0, { message: "El precio minorista debe ser un número positivo." }),
  currentStock: z.coerce
    .number()
    .min(0, { message: "El stock actual debe ser un número positivo." }),
  minimumStock: z.coerce
    .number()
    .min(0, { message: "El stock mínimo debe ser un número positivo." }),
  image: z.string().url({ message: "Debe ser una URL válida." }).optional().or(z.literal("")),
  associatedSuppliers: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
