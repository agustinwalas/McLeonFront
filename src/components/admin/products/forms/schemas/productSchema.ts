import { z } from "zod";
import { UnitOfMeasure } from "@/types/product";

// Schema para formularios de productos
export const productFormSchema = z.object({
  productCode: z.string().min(1, { message: "El código es obligatorio." }),
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  shopifyName: z.string().optional(),
  description: z.string().optional(),
  category: z.string(),
  collections: z.array(z.string()).optional(),
  purchaseCost: z.coerce
    .number()
    .min(0, { message: "El precio de costo debe ser un número positivo." }),
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
  images: z.array(z.string().url({ message: "Debe ser una URL válida." })),
  associatedSuppliers: z.array(z.string()).optional(),
  unitOfMeasure: z.nativeEnum(UnitOfMeasure, {
    errorMap: () => ({ message: "Debe seleccionar una unidad de medida válida." })
  }),
  activeInShopify: z.boolean(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
