import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";
import { Plus, X } from "lucide-react";

interface ProductImagesProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductImages({ form }: ProductImagesProps) {
  const images = form.watch("images") || [];

  const addImageField = () => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, ""]);
  };

  const removeImageField = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
  };

  const updateImageUrl = (index: number, url: string) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages[index] = url;
    form.setValue("images", newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Imágenes del Producto</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addImageField}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Imagen
        </Button>
      </div>
      
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`images.${index}` as any}
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`URL de la imagen ${index + 1}`}
                          value={image}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          type="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeImageField(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Preview de las imágenes */}
      {images.length > 0 && images.some(img => img.trim()) && (
        <div className="mt-4">
          <FormLabel className="text-sm font-medium">Vista Previa</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {images
              .filter(img => img.trim())
              .map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}