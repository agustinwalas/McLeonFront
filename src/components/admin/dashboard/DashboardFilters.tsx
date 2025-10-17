import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { DashboardFilters } from "@/types/dashboard";

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onApplyFilters: (filters?: Partial<DashboardFilters>) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

export function DashboardFiltersComponent({
  filters,
  onApplyFilters,
  isLoading,
}: DashboardFiltersProps) {
  const [localFilters, setLocalFilters] = useState<DashboardFilters>(filters);

  // Sincronizar filtros locales cuando cambien los del store
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalChange = (key: keyof DashboardFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    console.log("🎯 Aplicando filtros locales:", localFilters);
    onApplyFilters(localFilters);
  };


  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold">Filtros</h3>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Fecha Desde */}
        <div className="space-y-2 min-w-[140px] flex-1">
          <Label htmlFor="dateFrom">Fecha Desde</Label>
          <Input
            className="block"
            id="dateFrom"
            type="date"
            value={localFilters.dateFrom || ""}
            onChange={(e) => handleLocalChange("dateFrom", e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-2 min-w-[140px] flex-1">
          <Label htmlFor="dateTo">Fecha Hasta</Label>
          <Input
            className="block"
            id="dateTo"
            type="date"
            value={localFilters.dateTo || ""}
            onChange={(e) => handleLocalChange("dateTo", e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Granularidad del Período */}
        <div className="space-y-2 min-w-[120px]">
          <Label>Granularidad</Label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.period || "day"}
            onChange={(e) => handleLocalChange("period", e.target.value)}
            disabled={isLoading}
          >
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
          </select>
        </div>

        {/* Método de Pago */}
        <div className="space-y-2 min-w-[130px]">
          <Label>Método de Pago</Label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.paymentMethod || ""}
            onChange={(e) =>
              handleLocalChange("paymentMethod", e.target.value || undefined)
            }
            disabled={isLoading}
          >
            <option value="">Todos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
        </div>

        {/* Límite para Rankings */}
        <div className="space-y-2 min-w-[110px]">
          <Label>Límite Rankings</Label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.limit || 10}
            onChange={(e) =>
              handleLocalChange("limit", parseInt(e.target.value))
            }
            disabled={isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-2 min-w-[140px]">
          <Label>&nbsp;</Label> {/* Spacer para alineación */}
          <div className="flex space-x-2 mb-1">
            <Button onClick={handleApply} disabled={isLoading} className="px-6">
              Aplicar
            </Button>
          </div>
        </div>
      </div>

      {/* Información del Período */}
      <div className="text-xs text-muted-foreground pt-4 border-t mt-4">
        <p>
          Período: {localFilters.dateFrom} al {localFilters.dateTo}
        </p>
      </div>
    </div>
  );
}
