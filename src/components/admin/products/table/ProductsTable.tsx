
import { DefaultTable } from "../../table/DefaultTable";
import { useEffect } from "react";
import { productColumns } from "./ProductColumns";
import { useProductStore } from "@/store/useProduct";

export const ProductsTable = () => {
  const { 
    products, 
    loading, 
    error, 
    isInitialized,
    fetchProducts,
    clearError 
  } = useProductStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchProducts();
    }
  }, [isInitialized, fetchProducts]);

  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando productos...</div>
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
      <DefaultTable data={products} columns={productColumns} />
    </>
  );
};
