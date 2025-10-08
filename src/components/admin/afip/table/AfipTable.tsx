import { DefaultTable } from "../../table/DefaultTable";
import { useEffect } from "react";
import { useSalesStore } from "@/store/useSales";
import { AfipColumns } from "./AfipColumns";

export const AfipTable = () => {
  const { 
    sales, 
    isLoading,
    error, 
    fetchSales
  } = useSalesStore();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Filtrar solo las ventas que tienen datos de AFIP
  const salesWithAfip = sales.filter(sale => sale.afipData?.cae);

  // Manejo de estados
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando facturas AFIP...</div>
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

  if (salesWithAfip.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">No hay facturas AFIP generadas</div>
          <div className="text-sm text-gray-500 mt-2">
            Las ventas con comprobantes AFIP aparecerán aquí
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DefaultTable data={salesWithAfip} columns={AfipColumns} />
    </>
  );
};
