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
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";

import { useEffect } from "react";
import { ProductCreateInput, ICategory, ISupplier } from "@/types";
import { productFormSchema, ProductFormData } from "./schemas/productSchema";
import { useProductStore } from "@/store/useProduct";
import { useCategoryStore } from "@/store/useCategory";
import { useSupplierStore } from "@/store/useSupplier";

interface FormProps {
  onSuccess?: () => void;
}

export function NewProductForm({ onSuccess }: FormProps) {
  const { createProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productCode: "",
      name: "",
      category: "",
      wholesalePrice: 0,
      retailPrice: 0,
      currentStock: 0,
      minimumStock: 0,
      image: "",
      associatedSuppliers: [],
    },
  });

  async function onSubmit(values: ProductFormData) {
    try {
      const productData: ProductCreateInput = {
        productCode: values.productCode,
        name: values.name,
        category: values.category,
        wholesalePrice: values.wholesalePrice,
        retailPrice: values.retailPrice,
        currentStock: values.currentStock,
        minimumStock: values.minimumStock,
        image: values.image,
        associatedSuppliers: values.associatedSuppliers || [],
      };

      await createProduct(productData);
      
      // Reset form after successful creation
      form.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Código del Producto */}
        <FormField
          control={form.control}
          name="productCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: PROD001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Torta de Chocolate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categoría (ID de referencia) */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Seleccioná una categoría</option>
                  {categories.map((cat: ICategory) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Proveedores Asociados */}
        <FormField
          control={form.control}
          name="associatedSuppliers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedores Asociados</FormLabel>
              <FormControl>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  {suppliers.length > 0 ? (
                    <div className="space-y-2">
                      {suppliers.map((supplier: ISupplier) => (
                        <div key={supplier._id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`supplier-${supplier._id}`}
                            checked={(field.value || []).includes(supplier._id)}
                            onChange={(e) => {
                              const currentSuppliers = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentSuppliers, supplier._id]);
                              } else {
                                field.onChange(currentSuppliers.filter(id => id !== supplier._id));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`supplier-${supplier._id}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                          >
                            {supplier.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay proveedores disponibles</p>
                  )}
                </div>
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Seleccioná uno o varios proveedores que suministran este producto
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Precio Mayorista */}
        <FormField
          control={form.control}
          name="wholesalePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Mayorista</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ej: 1500.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Precio Minorista */}
        <FormField
          control={form.control}
          name="retailPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Minorista</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ej: 2000.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock Actual */}
        <FormField
          control={form.control}
          name="currentStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Actual</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock Mínimo */}
        <FormField
          control={form.control}
          name="minimumStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Mínimo</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imagen */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Imagen del Producto (Opcional)</FormLabel>
              <FormControl>
                <ImageUploadInput
                  onUpload={(url: string) => form.setValue("image", url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón submit */}
        <div className="submit-button">
          <Button type="submit" disabled={loading} className="w-full mt-5">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando producto...
              </>
            ) : (
              "Crear producto"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
