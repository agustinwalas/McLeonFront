import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { SalesByPeriod } from "@/types/dashboard";

interface SalesByPeriodChartProps {
  salesByPeriod: SalesByPeriod[];
  isLoading: boolean;
  period: 'day' | 'week' | 'month' | 'year';
}

export function SalesByPeriodChart({ salesByPeriod, isLoading, period }: SalesByPeriodChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num);
  };

  const formatPeriod = (periodStr: string, periodType: string) => {
    console.log('📅 [FRONTEND] Formateando período:', { periodStr, periodType });
    
    switch (periodType) {
      case 'day': {
        // Para días: "2025-10-17" → "17/10"
        const date = new Date(periodStr + 'T12:00:00');
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      }
      case 'week': {
        // Para semanas: "2025-S42" → "10/10 al 17/10"
        if (periodStr.includes('-S')) {
          const [year, weekPart] = periodStr.split('-S');
          const weekNumber = parseInt(weekPart);
          
          // Calcular la fecha del primer día de la semana ISO (lunes)
          const jan4 = new Date(parseInt(year), 0, 4); // 4 de enero
          const jan4DayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay(); // Lunes = 1, Domingo = 7
          const firstMonday = new Date(jan4.getTime() - (jan4DayOfWeek - 1) * 24 * 60 * 60 * 1000);
          
          // Calcular el lunes de la semana específica
          const weekStart = new Date(firstMonday.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
          
          const startStr = weekStart.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
          const endStr = weekEnd.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
          
          return `${startStr} al ${endStr}`;
        }
        return periodStr;
      }
      case 'month': {
        // Para meses: "2025-10" → "oct 25"
        const date = new Date(periodStr + '-01T12:00:00');
        return date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      }
      case 'year': {
        // Para años: "2025" → "2025"
        return periodStr;
      }
      default:
        return periodStr;
    }
  };

  const getMaxRevenue = () => {
    if (salesByPeriod.length === 0) return 0;
    return Math.max(...salesByPeriod.map(s => s.totalRevenue));
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Ventas por Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex-1 mx-4">
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (salesByPeriod.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Ventas por Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay datos de ventas para el período seleccionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = getMaxRevenue();
  const totalRevenue = salesByPeriod.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalSales = salesByPeriod.reduce((sum, s) => sum + s.salesCount, 0);
  const averageRevenue = totalRevenue / salesByPeriod.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Ventas por Período</span>
            <Badge variant="secondary">{salesByPeriod.length} períodos</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Facturación Total</p>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Ventas Totales</p>
            <p className="text-lg font-semibold text-green-600">{formatNumber(totalSales)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Promedio por Período</p>
            <p className="text-lg font-semibold text-purple-600">{formatCurrency(averageRevenue)}</p>
          </div>
        </div>

        {/* Gráfico de Barras Simplificado */}
        <div className="space-y-3">
          {salesByPeriod.map((sale, index) => {
            const percentage = maxRevenue > 0 ? (sale.totalRevenue / maxRevenue) * 100 : 0;
            const previousSale = index > 0 ? salesByPeriod[index - 1] : null;
            const growth = previousSale ? calculateGrowth(sale.totalRevenue, previousSale.totalRevenue) : 0;
            
            return (
              <div key={sale.period} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatPeriod(sale.period, period)}</span>
                  <div className="flex items-center space-x-2">
                    {previousSale && (
                      <div className={`flex items-center space-x-1 text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{Math.abs(growth).toFixed(1)}%</span>
                      </div>
                    )}
                    <span className="font-semibold">{formatCurrency(sale.totalRevenue)}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-white text-xs font-medium">
                          {formatNumber(sale.salesCount)}
                        </span>
                      )}
                    </div>
                  </div>
                  {percentage <= 20 && (
                    <span className="absolute right-0 top-0 h-3 flex items-center text-xs text-gray-600 ml-2">
                      {formatNumber(sale.salesCount)} ventas
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatNumber(sale.salesCount)} ventas</span>
                  <span>Ticket promedio: {formatCurrency(sale.averageTicket)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}