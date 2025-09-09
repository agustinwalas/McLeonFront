import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { useEffect } from "react";
import { ProductCreateInput } from "@/types";
import { UnitOfMeasure } from "@/types/product"; // ✅ Import agregado
import { productFormSchema, ProductFormData } from "./schemas/productSchema";
import { ProductPricing } from "./ProductPricing";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductStock } from "./ProductStock";
import { ProductSuppliers } from "./ProductSuppliers";
import { ProductImage } from "./ProductImage";
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
      purchaseCost: 0, 
      retailPrice: 0,
      currentStock: 0,
      minimumStock: 0,
      unitOfMeasure: UnitOfMeasure.UNIDAD, // ✅ Agregado con valor por defecto
      image: "",
      associatedSuppliers: [],
    },
  });

  async function onSubmit(values: ProductFormData) {
    try {
      console.log("🚀 Creando producto:", values);
      console.log("🏪 Proveedores seleccionados:", values.associatedSuppliers);

      const productData: ProductCreateInput = {
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

      await createProduct(productData);

      console.log("✅ Producto creado exitosamente");

      // Reset form after successful creation
      form.reset({
        productCode: "",
        name: "",
        category: "",
        wholesalePrice: 0,
        purchaseCost: 0,
        retailPrice: 0,
        currentStock: 0,
        minimumStock: 0,
        unitOfMeasure: UnitOfMeasure.UNIDAD, // ✅ Reset con valor por defecto
        image: "",
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


  {/* Imagen */}
  <ProductImage form={form} />

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
