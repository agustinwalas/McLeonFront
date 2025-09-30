// src/components/admin/shopify-collections/forms/EditCollectionForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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

import { IShopifyCollection } from "@/types";
import { editCollectionFormSchema, EditCollectionFormData } from "./schemas/collectionSchema";
import { useShopifyCollectionStore } from "@/store/useShopifyCollection";

interface EditCollectionFormProps {
  collection: IShopifyCollection;
  onSuccess?: () => void;
}

export function EditCollectionForm({ collection, onSuccess }: EditCollectionFormProps) {
  const { updateCollection, loading } = useShopifyCollectionStore();

  const form = useForm<EditCollectionFormData>({
    resolver: zodResolver(editCollectionFormSchema),
    defaultValues: {
      name: collection.collectionName,
      description: collection.description || "",
      type: collection.collectionType as "manual" | "featured" | "seasonal",
      imageUrl: (collection as any).imageUrl || "",
    },
  });


  // Reset form when collection changes
  useEffect(() => {
    form.reset({
      name: collection.collectionName,
      description: collection.description || "",
      type: collection.collectionType as "manual" | "featured" | "seasonal",
      imageUrl: (collection as any).imageUrl || "",
    });
  }, [collection, form]);

  async function onSubmit(values: EditCollectionFormData) {
    try {
      const updateData = {
        collectionName: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
        // Note: No actualizamos el tipo en la edición ya que cambia la naturaleza de la collection
      };

      await updateCollection(collection._id, updateData);
      
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
              <FormLabel>Nombre de la Colección</FormLabel>
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

        {/* Tipo (Solo lectura en edición) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Collection</FormLabel>
              <FormControl>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">
                    Tipo actual: <strong>
                      {field.value === 'manual' ? 'Categoria' : 
                       field.value === 'featured' ? 'Destacados' : 'Temporada'}
                    </strong>
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    El tipo no se puede cambiar después de crear la collection.
                  </p>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar Colección"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}