import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "@/store/useProduct";
import { ISupplier } from "@/types";

// Componentes separados
import { ProductHeader } from "./ProductHeader";
import { ProductImageCard } from "./ProductImageCard";
import { ProductDetailsCard } from "./ProductDetailsCard";
import { ProductSuppliersCard } from "./ProductSuppliersCard";
import { ProductLoadingSkeleton, ProductError, ProductNotFound } from "./ProductStates";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { product, loading: productLoading, error, fetchProductById, products, fetchProducts } = useProductStore();
  const [productSuppliers, setProductSuppliers] = useState<ISupplier[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (product) {
 
 
      
      // El backend ya está enviando los proveedores populados
      if (product.associatedSuppliers && product.associatedSuppliers.length > 0) {
        const mappedSuppliers = product.associatedSuppliers.map(supplier => ({
          ...supplier,
          suppliedProducts: (supplier as any).suppliedProducts || []
        }));
        setProductSuppliers(mappedSuppliers);
      } else {
        setProductSuppliers([]);
      }
    }
  }, [product]);

  if (productLoading) {
    return <ProductLoadingSkeleton />;
  }

  if (error) {
    return <ProductError error={error} />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <ProductHeader product={product} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImageCard product={product} />
        <ProductDetailsCard product={product} suppliers={productSuppliers} />
      </div>

      {/* Associated Suppliers */}
      <ProductSuppliersCard suppliers={productSuppliers} allProducts={products} />
    </div>
  );
}
