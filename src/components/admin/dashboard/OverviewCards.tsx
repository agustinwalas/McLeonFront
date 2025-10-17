import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react";
import { DashboardOverview } from "@/types/dashboard";

interface OverviewCardsProps {
  overview: DashboardOverview | null;
  isLoading: boolean;
}

export function OverviewCards({ overview, isLoading }: OverviewCardsProps) {
  console.log('📊 OverviewCards - Props:', { overview, isLoading });
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full text-center py-8 text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      </div>
    );
  }

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

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <TrendingUp className="h-4 w-4 text-gray-400" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Ventas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
          <div className="flex items-center space-x-1">
            {getGrowthIcon(overview.growthRate)}
            <p className={`text-xs ${getGrowthColor(overview.growthRate)}`}>
              {overview.growthRate > 0 ? '+' : ''}{overview.growthRate.toFixed(1)}% vs período anterior
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cantidad de Ventas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cantidad Ventas</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.totalSales)}</div>
          <p className="text-xs text-muted-foreground">
            Ticket promedio: {formatCurrency(overview.averageTicket)}
          </p>
        </CardContent>
      </Card>

      {/* Total Clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.totalClients)}</div>
          <p className="text-xs text-muted-foreground">
            En el período seleccionado
          </p>
        </CardContent>
      </Card>

      {/* Total Productos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.totalProducts)}</div>
          <p className="text-xs text-muted-foreground">
            Productos únicos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}