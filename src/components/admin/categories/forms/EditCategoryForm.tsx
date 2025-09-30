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
import { Loader2 } from "lucide-react";

import { useEffect } from "react";
import { CategoryUpdateInput, ICategory } from "@/types";
import { categoryFormSchema, CategoryFormData } from "./schemas/categorySchema";
import { useCategoryStore } from "@/store/useCategory";
import { Checkbox } from "@/components/ui/checkbox";

interface FormProps {
  category: ICategory; // Categoría a editar
  onSuccess?: () => void;
}

export function EditCategoryForm({ category, onSuccess }: FormProps) {
  const { updateCategory, loading } = useCategoryStore();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      fullName: category.fullName,
      active: category.active,
    },
  });

  // Actualizar valores del formulario cuando cambie la categoría
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        fullName: category.fullName,
        active: category.active,
      });
    }
  }, [category, form]);

  async function onSubmit(values: CategoryFormData) {
    try {
      const categoryData: CategoryUpdateInput = {
        name: values.name,
        fullName: values.fullName,
        active: values.active,
      };

      await updateCategory(category._id, categoryData);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la Categoría */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Categoría (Corto)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Tortas, Galletas, Postres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre Completo */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Tortas de Cumpleaños, Galletas Artesanales, Postres Gourmet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado Activo */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Categoría activa
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Las categorías inactivas no aparecerán en los formularios.
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Botón submit */}
        <div className="submit-button">
          <Button type="submit" disabled={loading} className="w-full mt-5">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando categoría...
              </>
            ) : (
              "Actualizar categoría"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
