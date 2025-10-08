import { DefaultTable } from "../../table/DefaultTable";
import { useEffect } from "react";
import { useCategoryStore } from "@/store/useCategory";
import { categoryColumns } from "./CategoryColumns";

export const CategoriesTable = () => {
  const { 
    categories, 
    loading, 
    error, 
    isInitialized,
    fetchCategories,
    clearError 
  } = useCategoryStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchCategories();
    }
  }, [isInitialized, fetchCategories]);

  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando categorías...</div>
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
      <DefaultTable data={categories} columns={categoryColumns} />
    </>
  );
};