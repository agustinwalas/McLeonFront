// src/components/admin/shopify-collections/forms/NewManualCollectionForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { ShopifyCollectionCreateInput } from "@/types";
import { collectionFormSchema, CollectionFormData } from "./schemas/collectionSchema";
import { useShopifyCollectionStore } from "@/store/useShopifyCollection";

interface FormProps {
  onSuccess?: () => void;
}

export function NewManualCollectionForm({ onSuccess }: FormProps) {
  const { createManualCollection, loading } = useShopifyCollectionStore();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "manual",
    },
  });


  async function onSubmit(values: CollectionFormData) {
    try {
      const collectionData: ShopifyCollectionCreateInput = {
        name: values.name,
        description: values.description,
        type: values.type,
        imageUrl: values.imageUrl || undefined,
      };

      await createManualCollection(collectionData);
      
      // Reset form after successful creation
      form.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled in the store
      console.error("Form submission error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Collection</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ej: Productos Destacados" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la collection..."
                  className="resize-none"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL Imagen */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  {...field}
                  value={field.value || ''}
                  disabled={loading}
                />
              </FormControl>
              {field.value && (
                <div className="mt-2">
                  <img
                    src={field.value}
                    alt="Previsualización"
                    className="max-h-32 rounded border"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Collection</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="manual"
                      checked={field.value === "manual"}
                      onChange={() => field.onChange("manual")}
                      disabled={loading}
                      className="text-blue-600"
                    />
                    <span>Categoria</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="featured"
                      checked={field.value === "featured"}
                      onChange={() => field.onChange("featured")}
                      disabled={loading}
                      className="text-blue-600"
                    />
                    <span>Destacados</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="seasonal"
                      checked={field.value === "seasonal"}
                      onChange={() => field.onChange("seasonal")}
                      disabled={loading}
                      className="text-blue-600"
                    />
                    <span>Temporada</span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Collection"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}