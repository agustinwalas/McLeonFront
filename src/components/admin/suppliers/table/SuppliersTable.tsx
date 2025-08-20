import { DefaultTable } from "../../table/DefaultTable";
import { useEffect, useMemo } from "react";
import { useSupplierStore } from "@/store/useSupplier";
import { useProductStore } from "@/store/useProduct";
import { createSupplierColumns } from "./SupplierColumns";

export const SuppliersTable = () => {
  const { 
    suppliers, 
    loading, 
    error, 
    isInitialized,
    fetchSuppliers,
    clearError 
  } = useSupplierStore();

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchSuppliers();
    }
    fetchProducts();
  }, [isInitialized, fetchSuppliers, fetchProducts]);

  // Crear las columnas con los productos actuales
  const supplierColumns = useMemo(() => {
    return createSupplierColumns(products);
  }, [products]);

  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando proveedores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex justify-between items-center">
          <span className="text-red-800">Error: {error}</span>
          <button 
            onClick={clearError}
            className="text-red-600 hover:text-red-800 underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DefaultTable data={suppliers} columns={supplierColumns} />
    </>
  );
};
