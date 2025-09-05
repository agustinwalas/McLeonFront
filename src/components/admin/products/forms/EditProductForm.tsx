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
import { ProductUpdateInput, ICategory, IProductPopulated, ISupplier } from "@/types";
import { UnitOfMeasure } from "@/types/product"; // ✅ Import agregado
import { productFormSchema, ProductFormData } from "./schemas/productSchema";
import { useProductStore } from "@/store/useProduct";
import { useCategoryStore } from "@/store/useCategory";
import { useSupplierStore } from "@/store/useSupplier";

interface FormProps {
  product: IProductPopulated;
  onSuccess?: () => void;
}

export function EditProductForm({ product, onSuccess }: FormProps) {
  const { updateProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, [fetchCategories, fetchSuppliers]);

  // ✅ Función para extraer el ID de categoría de forma segura
  const getCategoryId = (category: any): string => {
    if (!category) {
      return ""; // Sin categoría
    }
    
    if (typeof category === 'string') {
      return category; // Ya es un ID
    }
    
    // ✅ Manejar estructura anidada extraña
    if (category._id && typeof category._id === 'object' && category._id._id) {
      return category._id._id; // Estructura anidada
    }
    
    // ✅ Estructura normal
    if (category._id) {
      return category._id; // Objeto con _id
    }
    
    return ""; // Fallback
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productCode: product.productCode || "",
      name: product.name || "",
      category: getCategoryId(product.category),
      wholesalePrice: product.wholesalePrice || 0,
      retailPrice: product.retailPrice || 0,
      currentStock: product.currentStock || 0,
      minimumStock: product.minimumStock || 0,
      unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD, // ✅ Agregado con fallback
      image: product.image || "",
      associatedSuppliers: (product.associatedSuppliers || []).map(supplier => 
        typeof supplier === 'string' ? supplier : supplier._id
      ),
    },
  });

  // Actualizar valores del formulario cuando cambie el producto
  useEffect(() => {
    if (product) {
      form.reset({
        productCode: product.productCode || "",
        name: product.name || "",
        category: getCategoryId(product.category),
        wholesalePrice: product.wholesalePrice || 0,
        retailPrice: product.retailPrice || 0,
        currentStock: product.currentStock || 0,
        minimumStock: product.minimumStock || 0,
        unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD, // ✅ Agregado con fallback
        image: product.image || "",
        associatedSuppliers: (product.associatedSuppliers || []).map(supplier => 
          typeof supplier === 'string' ? supplier : supplier._id
        ),
      });
    }
  }, [product, form]);

  async function onSubmit(values: ProductFormData) {
    try {
      console.log("🔄 Actualizando producto:", product._id);
      console.log("📦 Datos del formulario:", values);
      console.log("🏪 Proveedores seleccionados:", values.associatedSuppliers);

      const productData: ProductUpdateInput = {
        productCode: values.productCode,
        name: values.name,
        category: values.category || undefined, // ✅ Si está vacío, enviar undefined
        wholesalePrice: values.wholesalePrice,
        retailPrice: values.retailPrice,
        currentStock: values.currentStock,
        minimumStock: values.minimumStock,
        unitOfMeasure: values.unitOfMeasure, // ✅ Agregado
        image: values.image || undefined,
        associatedSuppliers: values.associatedSuppliers || [],
      };

      await updateProduct(product._id, productData);
      
      console.log("✅ Producto actualizado exitosamente");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
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

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <select
                  value={field.value || ""} // ✅ Fallback a string vacío
                  onChange={(e) => field.onChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Sin categoría</option> {/* ✅ Opción para sin categoría */}
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

        {/* ✅ NUEVO CAMPO: Unidad de Medida */}
        <FormField
          control={form.control}
          name="unitOfMeasure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidad de Medida</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value as UnitOfMeasure)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={UnitOfMeasure.UNIDAD}>Unidad</option>
                  <option value={UnitOfMeasure.GRAMO}>Gramo</option>
                  <option value={UnitOfMeasure.KILOGRAMO}>Kilogramo</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Proveedores Asociados - Diseño original pero funcionalidad corregida */}
        <FormField
          control={form.control}
          name="associatedSuppliers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedores Asociados</FormLabel>
              <FormControl>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                  {suppliers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {suppliers.map((supplier: ISupplier) => {
                        const isChecked = (field.value || []).includes(supplier._id);
                        
                        return (
                          <label 
                            key={supplier._id}
                            className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                              isChecked 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const currentSuppliers = field.value || [];
                                if (e.target.checked) {
                                  field.onChange([...currentSuppliers, supplier._id]);
                                  console.log("✅ Proveedor agregado:", supplier.name);
                                } else {
                                  field.onChange(currentSuppliers.filter(id => id !== supplier._id));
                                  console.log("❌ Proveedor removido:", supplier.name);
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700 flex-1">
                              {supplier.name}
                            </span>
                            {isChecked && (
                              <span className="text-xs text-blue-600 font-medium">✓</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No hay proveedores disponibles</p>
                      <p className="text-gray-400 text-xs mt-1">Crear proveedores primero</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                ✅ Seleccionados: {(field.value || []).length} proveedor(es)
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wholesalePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Mayorista</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="1500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retailPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Minorista</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="2000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currentStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Actual</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    console.log("🖼️ Imagen subida:", url);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando producto...
            </>
          ) : (
            "Actualizar producto"
          )}
        </Button>
      </form>
    </Form>
  );
}
