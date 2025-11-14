import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductPricing } from "./ProductPricing";
import { ProductStock } from "./ProductStock";
import { ProductSuppliers } from "./ProductSuppliers";
import { ProductImages } from "./ProductImages";
import { ProductShopify } from "./ProductShopify";

import { useEffect } from "react";
import { ProductUpdateInput, IProductPopulated } from "@/types";
import { UnitOfMeasure } from "@/types/product"; // ✅ Import agregado
import { productFormSchema, ProductFormData } from "./schemas/productSchema";
import { useProductStore } from "@/store/useProduct";
import { useCategoryStore } from "@/store/useCategory";
import { useSupplierStore } from "@/store/useSupplier";
import { ProductCollections } from "./ProductCollections";
import { ProductActiveShopify } from "../ProductActiveShopify";

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

    if (typeof category === "string") {
      return category; // Ya es un ID
    }

    // ✅ Manejar estructura anidada extraña
    if (category._id && typeof category._id === "object" && category._id._id) {
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
      shopifyName: product.shopifyName || "",
      category: getCategoryId(product.category),
      wholesalePrice: product.wholesalePrice || 0,
      purchaseCost: product.purchaseCost || 0,
      retailPrice: product.retailPrice || 0,
      currentStock: product.currentStock || 0,
      minimumStock: product.minimumStock || 0,
      unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD,
      images: [],
      activeInShopify: product.activeInShopify || false,
      description: product.description || "",
      associatedSuppliers: Array.isArray(product.associatedSuppliers)
        ? product.associatedSuppliers.map((supplier) =>
            typeof supplier === "string" ? supplier : supplier._id
          )
        : [],
      collections: (product.collections || []).map((collection) =>
        typeof collection === "string" ? collection : collection._id
      ),
    },
  });

  // Actualizar valores del formulario cuando cambie el producto
  useEffect(() => {
    if (product) {
      form.reset({
        productCode: product.productCode || "",
        name: product.name || "",
        shopifyName: product.shopifyName || "",
        category: getCategoryId(product.category),
        wholesalePrice: product.wholesalePrice || 0,
        purchaseCost: product.purchaseCost || 0,
        retailPrice: product.retailPrice || 0,
        currentStock: product.currentStock || 0,
        minimumStock: product.minimumStock || 0,
        unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD,
        images: product.images || [],
        activeInShopify: product.activeInShopify || false,
        description: product.description || "",
        associatedSuppliers: Array.isArray(product.associatedSuppliers)
          ? product.associatedSuppliers.map((supplier) =>
              typeof supplier === "string" ? supplier : supplier._id
            )
          : [],
        collections: (product.collections || []).map((collection) =>
          typeof collection === "string" ? collection : collection._id
        ),
      });
    }
  }, [product, form]);

  async function onSubmit(values: ProductFormData) {
    try {
 
 
 

      const productData: ProductUpdateInput = {
        productCode: values.productCode,
        name: values.name,
        shopifyName: values.shopifyName,
        description: values.description, 
        category: values.category || undefined,
        purchaseCost: values.purchaseCost,
        wholesalePrice: values.wholesalePrice,
        activeInShopify: values.activeInShopify,
        retailPrice: values.retailPrice,
        currentStock: values.currentStock,
        minimumStock: values.minimumStock,
        unitOfMeasure: values.unitOfMeasure,
        images: values.images || undefined,
        associatedSuppliers: values.associatedSuppliers || [],
        collections: values.collections || [],
      };

      await updateProduct(product._id, productData);

 

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
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Administración</TabsTrigger>
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4 mt-4">
            {/* Datos básicos */}
            <ProductBasicInfo form={form} categories={categories} />

            {/* Precios */}
            <ProductPricing form={form} />

            {/* Stock */}
            <ProductStock form={form} />

            {/* Proveedores */}
            <ProductSuppliers form={form} suppliers={suppliers} />
          </TabsContent>

          <TabsContent value="shopify" className="space-y-4 mt-4">
            {/* Shopify (activo, nombre, descripción) */}
            <ProductShopify form={form} />

            {/* Colecciones */}
            <ProductCollections form={form} />

            {/* Imágenes */}
            <ProductImages form={form} />

            {/* Activo en Shopify */}
            <ProductActiveShopify form={form} />

            
          </TabsContent>
        </Tabs>

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
