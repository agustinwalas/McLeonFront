import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  active: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
