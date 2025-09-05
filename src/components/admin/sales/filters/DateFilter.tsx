import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, List } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface DateFilterProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const DateFilter = ({ selectedDate, onDateChange }: DateFilterProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // ✅ Establecer la fecha actual como fecha por defecto al montar el componente
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      onDateChange(today);
    }
  }, []); // Solo se ejecuta al montar

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  // ✅ Función para mostrar todas las ventas (sin filtro de fecha)
  const showAllSales = () => {
    onDateChange(undefined);
  };

  // ✅ Obtener fecha máxima (hoy)
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Final del día para incluir todo el día de hoy

  return (
    <div className="flex items-center gap-2">
      {/* ✅ Botón principal con popover */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              selectedDate && "border-gray-500 bg-gray-50 text-gray-700"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })
            ) : (
              "Filtrar por fecha"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            locale={es}
            className="rounded-md border"
            disabled={(date) => date > today} // ✅ Deshabilitar fechas futuras
            toDate={today} // ✅ Fecha máxima permitida (hoy)
          />
        </PopoverContent>
      </Popover>

      {/* ✅ Botón para mostrar todas las ventas */}
      <Button
        variant="outline"
        onClick={showAllSales}
        className={cn(
          "px-3",
          !selectedDate && "border-gray-500 bg-gray-50 text-gray-700"
        )}
        title="Ver todas las ventas"
      >
        <List className="h-4 w-4" />
      </Button>

    </div>
  );
};