// src/components/admin/sales/table/SalesTable.tsx
import { useEffect } from "react";
import { DefaultTable } from "../../table/DefaultTable";
import { salesColumns } from "./SalesColumns";
import useSalesStore from "@/store/useSales";

function SalesTable() {
  const { 
    sales, 
    loading, 
    error, 
    fetchSales,
    clearError 
  } = useSalesStore();
  
useEffect(() => {
    console.log("🔄 SalesTable - useEffect ejecutándose");
    console.log("📊 Estado actual:", { 
      sales: sales?.length || 0, 
      loading, 
      error 
    });
    
    fetchSales().catch(err => {
      console.error("❌ Error en fetchSales:", err);
    });
  }, [fetchSales]);

  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando ventas...</div>
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
      <DefaultTable data={sales} columns={salesColumns} />
    </>
  );
}

export { SalesTable };
