
import { useEffect } from "react";
import { useShopifySalesColumns } from "./shopifySalesColumns";
import { useShopifySalesStore } from "@/store/useShopifySales";
import { DefaultTable } from "../table/DefaultTable";

export const ShopifySalesTable = () => {
  const { sales, loading, error, fetchSales } = useShopifySalesStore();
  const columns = useShopifySalesColumns();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando ventas de Shopify...</div>
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

  return <DefaultTable data={sales} columns={columns} />;
};
