import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SalesTable } from "@/components/admin/sales/table/SalesTable";
import { DateFilter } from "@/components/admin/sales/filters/DateFilter";
import { useState, useEffect } from "react";
import { useSalesStore } from "@/store/useSales";
import { format } from "date-fns";

export const Sales = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // ✅ Usar el store para hacer los fetches
  const { fetchSales, fetchSalesByDate } = useSalesStore();

  useEffect(() => {
    // Al cargar la página, usar la fecha de hoy por defecto
    const today = new Date();
    const dateString = format(today, 'yyyy-MM-dd');
    setSelectedDate(today);
    fetchSalesByDate(dateString);
  }, []);

  // ✅ useEffect que se ejecuta cuando cambia selectedDate
  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      console.log("Cargando ventas del día:", dateString);
      fetchSalesByDate(dateString);
    } else {
      console.log("Cargando todas las ventas");
      fetchSales();
    }
  }, [selectedDate]); // Solo depende de selectedDate

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-xl font-semibold">Ventas</h1>
        <div className="flex flex-wrap gap-2">
          {/* ✅ Componente DateFilter */}
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          {/* Botón Nueva Venta */}
          <Button
            className="btn btn-primary"
            onClick={() => navigate("/admin/ventas/nueva")}
          >
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* ✅ La tabla se actualiza automáticamente cuando cambia el store */}
      <SalesTable />
    </>
  );
};
