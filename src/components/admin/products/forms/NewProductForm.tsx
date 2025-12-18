import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { useEffect } from "react";
import { ProductCreateInput } from "@/types";
import { UnitOfMeasure } from "@/types/product";
import { productFormSchema, ProductFormData } from "./schemas/productSchema";
import { ProductPricing } from "./ProductPricing";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductStock } from "./ProductStock";
import { ProductSuppliers } from "./ProductSuppliers";
import { ProductImages } from "./ProductImages";
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
      description: \"\",
      category: \"\",
      wholesalePrice: 0,
      purchaseCost: 0,
      retailPrice: 0,
      currentStock: 0,
      minimumStock: 0,
      unitOfMeasure: UnitOfMeasure.UNIDAD,
      images: [],
      associatedSuppliers: [],
    },
  });

  async function onSubmit(values: ProductFormData) {
    try {
      const productData: ProductCreateInput = {
        productCode: values.productCode,
        name: values.name,
        description: values.description,
        category: values.category || undefined,
        purchaseCost: values.purchaseCost,
        wholesalePrice: values.wholesalePrice,
        retailPrice: values.retailPrice,
        currentStock: values.currentStock,
        minimumStock: values.minimumStock,
        unitOfMeasure: values.unitOfMeasure,
        images: values.images || [],
        associatedSuppliers: values.associatedSuppliers || [],
      };

      await createProduct(productData);

      // Reset form after successful creation
      form.reset({
        productCode: "",
        name: "",
        description: "",
        category: "",
        wholesalePrice: 0,
        purchaseCost: 0,
        retailPrice: 0,
        currentStock: 0,
        minimumStock: 0,
        unitOfMeasure: UnitOfMeasure.UNIDAD, // ✅ Reset con valor por defecto
        images: [],
        associatedSuppliers: [],
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error creating product:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Datos básicos */}
        <ProductBasicInfo form={form} categories={categories} />

        {/* Precios */}
        <ProductPricing form={form} />

        {/* Stock */}
        <ProductStock form={form} />

        {/* Proveedores */}
        <ProductSuppliers form={form} suppliers={suppliers} />

        {/* Imágenes */}
        <ProductImages form={form} />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando producto...
            </>
          ) : (
            "Crear producto"
          )}
        </Button>
      </form>
    </Form>
  );
}
