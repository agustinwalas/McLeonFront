// src/components/admin/sales/table/SalesTable.tsx

import { DefaultTable } from "../../table/DefaultTable";
import { salesColumns } from "./SalesColumns";
import { useSalesStore } from "@/store/useSales"; // ✅ Corregido: named export

interface SalesTableProps {
  showOnlyDebt?: boolean;
}

function SalesTable({ showOnlyDebt = false }: SalesTableProps) {
  
  const { sales, isLoading, error } = useSalesStore();

  // Filter sales with debt if showOnlyDebt is true
  const filteredSales = showOnlyDebt 
    ? sales.filter(sale => {
        const remaining = sale.totalAmount - (sale.amountPaid || 0);
        return remaining > 0;
      })
    : sales;

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
      <DefaultTable data={filteredSales} columns={salesColumns} />
    </>
  );
}

export { SalesTable };
