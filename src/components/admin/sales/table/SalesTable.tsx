// src/components/admin/sales/table/SalesTable.tsx

import { DefaultTable } from "../../table/DefaultTable";
import { salesColumns } from "./SalesColumns";
import { useSalesStore } from "@/store/useSales"; // ✅ Corregido: named export



function SalesTable() {
  
  const { sales, isLoading, error } = useSalesStore();

  if (isLoading) {
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
