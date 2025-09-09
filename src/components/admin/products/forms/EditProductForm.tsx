import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductPricing } from "./ProductPricing";
import { ProductStock } from "./ProductStock";
import { ProductSuppliers } from "./ProductSuppliers";
import { ProductImage } from "./ProductImage";

import { useEffect } from "react";
import { ProductUpdateInput, IProductPopulated } from "@/types";
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
      purchaseCost: product.purchaseCost || 0,
      retailPrice: product.retailPrice || 0,
      currentStock: product.currentStock || 0,
      minimumStock: product.minimumStock || 0,
      unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD, 
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
        purchaseCost: product.purchaseCost || 0,
        retailPrice: product.retailPrice || 0,
        currentStock: product.currentStock || 0,
        minimumStock: product.minimumStock || 0,
        unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD, 
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
        category: values.category || undefined, 
        purchaseCost: values.purchaseCost,
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
        

  {/* Datos básicos */}
  <ProductBasicInfo form={form} categories={categories} />


  {/* Proveedores */}
  <ProductSuppliers form={form} suppliers={suppliers} />


  {/* Precios */}
  <ProductPricing form={form} />


  {/* Stock */}
  <ProductStock form={form} />


  {/* Imagen */}
  <ProductImage form={form} />

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
