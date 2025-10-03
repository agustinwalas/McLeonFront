// src/components/admin/shopify-collections/forms/schemas/collectionSchema.ts
import { z } from "zod";

export const collectionFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(100, {
      message: "El nombre no puede tener más de 100 caracteres.",
    }),
  description: z
    .string()
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres.",
    })
    .optional(),
  type: z.enum(['manual', 'featured', 'seasonal'], {
    required_error: "Selecciona un tipo de collection.",
  }),
  imageUrl: z
    .string()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío.",
    })
    .optional(),
});

export const editCollectionFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(100, {
      message: "El nombre no puede tener más de 100 caracteres.",
    }),
  description: z
    .string()
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres.",
    })
    .optional(),
  type: z.enum(['manual', 'featured', 'seasonal']).optional(), // Solo para mostrar, no para validar
  imageUrl: z
    .string()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Debe ser una URL válida o estar vacío.",
    })
    .optional(),
});

export const categoryCollectionFormSchema = z.object({
  categoryId: z
    .string()
    .min(1, {
      message: "Selecciona una categoría.",
    }),
});

export type CollectionFormData = z.infer<typeof collectionFormSchema>;
export type EditCollectionFormData = z.infer<typeof editCollectionFormSchema>;
export type CategoryCollectionFormData = z.infer<typeof categoryCollectionFormSchema>;