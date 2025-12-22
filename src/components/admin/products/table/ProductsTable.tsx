
import { DefaultTable } from "../../table/DefaultTable";
import { useEffect } from "react";
import { useProductColumns } from "./ProductColumns";
import { useState, useMemo } from "react";
import { useProductStore } from "@/store/useProduct";
import { useCategoryStore } from "@/store/useCategory";


export const ProductsTable = () => {
  const { 
    products, 
    loading, 
    error, 
    isInitialized,
    fetchProducts,
    clearError 
  } = useProductStore();
  const { 
    fetchCategories,
    isInitialized: categoriesInitialized 
  } = useCategoryStore();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const columns = useProductColumns(categoryFilter, setCategoryFilter);
  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter((p) => {
      const cat = p.category;
      if (!cat) return categoryFilter === "null";
      if (typeof cat === "string") return false;
      
      // Handle different _id types
      let idToCompare: string | null = null;
      if (cat._id) {
        if (typeof cat._id === "string") {
          idToCompare = cat._id;
        } else if (typeof cat._id === "object") {
          if ((cat._id as any)._id) {
            idToCompare = (cat._id as any)._id;
          } else if ((cat._id as any).toString) {
            idToCompare = (cat._id as any).toString();
          }
        }
      }
      
      if (idToCompare) return idToCompare === categoryFilter;
      if (cat._id === undefined && cat.name) return cat.name === categoryFilter;
      return false;
    });
  }, [products, categoryFilter]);

  useEffect(() => {
    if (!isInitialized) {
      fetchProducts();
    }
  }, [isInitialized, fetchProducts]);

  useEffect(() => {
    console.log('PRODUCTS DATA:', products);
    console.log('PRODUCTS LENGTH:', products.length);
  }, [products]);

  useEffect(() => {
    if (!categoriesInitialized) {
      fetchCategories();
    }
  }, [categoriesInitialized, fetchCategories]);

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
      <DefaultTable data={filteredProducts} columns={columns} />
    </>
  );
};
