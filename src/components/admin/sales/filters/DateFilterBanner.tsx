import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateFilterBannerProps {
  selectedDate: Date;
  onClearFilter: () => void;
}

export const DateFilterBanner = ({ selectedDate, onClearFilter }: DateFilterBannerProps) => {
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Mostrando ventas del día: {" "}
            <span className="font-medium">
              {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        >
          Ver todas las ventas
        </Button>
      </div>
    </div>
  );
};