import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SalesTable } from "@/components/admin/sales/table/SalesTable";
import { DateFilter } from "@/components/admin/sales/filters/DateFilter";
import { useState, useEffect } from "react";
import { useSalesStore } from "@/store/useSales";
import { format } from "date-fns";
import { CircleDollarSign } from "lucide-react";

export const Sales = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showOnlyDebt, setShowOnlyDebt] = useState(false);

  const { fetchSales, fetchSalesByDate } = useSalesStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dateString = format(today, "yyyy-MM-dd");
    setSelectedDate(today);
    fetchSalesByDate(dateString);
    setIsInitialized(true);
  }, [fetchSalesByDate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      fetchSalesByDate(dateString);
    } else {
      fetchSales();
    }
  }, [selectedDate, isInitialized, fetchSales, fetchSalesByDate]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-xl font-semibold">Ventas</h1>
        <div className="flex flex-wrap gap-2">
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          <Button
            variant={showOnlyDebt ? "default" : "outline"}
            onClick={() => setShowOnlyDebt(!showOnlyDebt)}
            className={showOnlyDebt ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            <CircleDollarSign className="h-4 w-4" />
          </Button>

          <Button
            className="btn btn-primary"
            onClick={() => navigate("/admin/ventas/nueva")}
          >
            Nueva Venta
          </Button>
        </div>
      </div>

      <SalesTable showOnlyDebt={showOnlyDebt} />
    </>
  );
};
