import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "@/store/useProduct";
import { useSupplierStore } from "@/store/useSupplier";
import { IProductPopulated } from "@/types";

// Components
import { SupplierSkeleton } from "./SupplierSkeleton";
import { SupplierNotFound } from "./SupplierNotFound";
import { SupplierError } from "./SupplierError";
import { SupplierHeader } from "./SupplierHeader";
import { SupplierInfoCard } from "./SupplierInfoCard";
import { SupplierStatsCard } from "./SupplierStatsCard";
import { SupplierProductsCard } from "./SupplierProductsCard";

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    supplier,
    loading: supplierLoading,
    error,
    fetchSupplierById,
  } = useSupplierStore();
  const { products, fetchProducts } = useProductStore();
  const [supplierProducts, setSupplierProducts] = useState<IProductPopulated[]>([]);

  useEffect(() => {
    if (id) {
      fetchSupplierById(id);
    }
  }, [id, fetchSupplierById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (supplier && products.length > 0) {
      // Corregir la lógica: ahora associatedSuppliers son objetos con _id
      const associatedProducts = products.filter((product) =>
        product.associatedSuppliers.some(
          (supplierObj) => supplierObj._id === supplier._id
        )
      );
      setSupplierProducts(associatedProducts);
    }
  }, [supplier, products]);

  const handleRetry = () => {
    if (id) {
      fetchSupplierById(id);
    }
  };

  // Loading state
  if (supplierLoading) {
    return <SupplierSkeleton />;
  }

  // Error state
  if (error) {
    return <SupplierError error={error} onRetry={handleRetry} />;
  }

  // Not found state
  if (!supplier) {
    return <SupplierNotFound />;
  }

  // Success state
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <SupplierHeader supplier={supplier} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Info */}
        <SupplierInfoCard supplier={supplier} />

        {/* Supplier Stats */}
        <SupplierStatsCard 
          supplier={supplier} 
          supplierProducts={supplierProducts} 
        />
      </div>

      {/* Associated Products */}
      <SupplierProductsCard 
        supplierProducts={supplierProducts} 
        supplier={supplier}
      />
    </div>
  );
}
