import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";

interface ProductImageProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductImage({ form }: ProductImageProps) {
  return (
    <FormField
      control={form.control}
      name="image"
      render={() => (
        <FormItem>
          <FormLabel>Imagen del Producto (Opcional)</FormLabel>
          <FormControl>
            <ImageUploadInput
              onUpload={(url: string) => {
                form.setValue("image", url);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
