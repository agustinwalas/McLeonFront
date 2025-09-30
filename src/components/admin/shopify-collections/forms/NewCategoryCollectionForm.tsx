// src/components/admin/shopify-collections/forms/NewCategoryCollectionForm.tsx
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
import { Loader2 } from "lucide-react";

import { ShopifyCollectionFromCategoryInput } from "@/types";
import { categoryCollectionFormSchema, CategoryCollectionFormData } from "./schemas/collectionSchema";
import { useShopifyCollectionStore } from "@/store/useShopifyCollection";
import { useCategoryStore } from "@/store/useCategory";

interface FormProps {
  onSuccess?: () => void;
}

export function NewCategoryCollectionForm({ onSuccess }: FormProps) {
  const { createCollectionFromCategory, loading } = useShopifyCollectionStore();
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();

  const form = useForm<CategoryCollectionFormData>({
    resolver: zodResolver(categoryCollectionFormSchema),
    defaultValues: {
      categoryId: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function onSubmit(values: CategoryCollectionFormData) {
    try {
      const collectionData: ShopifyCollectionFromCategoryInput = {
        categoryId: values.categoryId,
      };

      await createCollectionFromCategory(collectionData);
      
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

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Categoría */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        value={category._id}
                        checked={field.value === category._id}
                        onChange={() => field.onChange(category._id)}
                        disabled={loading}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{category.fullName || category.name}</div>
                        {category.fullName && category.name !== category.fullName && (
                          <div className="text-sm text-gray-500">{category.name}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {categories.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No hay categorías disponibles. Crea una categoría primero.
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={loading || categories.length === 0}
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