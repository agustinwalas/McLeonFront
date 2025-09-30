
import { ShopifySalesTable } from "@/components/admin/shopify-sales/shopifySalesTable";

import { useState, useEffect } from "react";
import { DateFilter } from "@/components/admin/sales/filters/DateFilter";
import { useShopifySalesStore } from "@/store/useShopifySales";

export default function ShopifySalesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { fetchSales } = useShopifySalesStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    // Si tu backend soporta filtro por fecha, deberías llamar a un fetchSalesByDate aquí
    fetchSales();
    setIsInitialized(true);
  }, [fetchSales]);

  useEffect(() => {
    if (!isInitialized) return;
    if (selectedDate) {
      // Si tu backend soporta filtro por fecha, deberías llamar a un fetchSalesByDate aquí
      fetchSales();
    } else {
      fetchSales();
    }
  }, [selectedDate, isInitialized, fetchSales]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-xl font-semibold">Ventas Shopify</h1>
        <div className="flex flex-wrap gap-2">
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
      </div>

      <ShopifySalesTable />
    </>
  );
}
