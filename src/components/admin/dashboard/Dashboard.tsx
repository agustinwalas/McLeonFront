// src/components/admin/dashboard/Dashboard.tsx

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Store
import useDashboard from "@/store/useDashboard";

// Components
import { OverviewCards } from "./OverviewCards";
import { DashboardFiltersComponent } from "./DashboardFilters";
import { RankingCards } from "./RankingCards";
import { StatsCards } from "./StatsCards";
import { SalesByPeriodChart } from "./SalesByPeriodChart";

export function DashboardComponent() {
  const {
    // Data
    overview,
    salesByPeriod,
    topProducts,
    topClients,
    paymentMethods,
    afipStats,
    filters,
    
    // UI States
    isLoading,
    isInitialized,
    error,
    
    // Actions
    fetchDashboardData,
    updateFilters,
    resetFilters,
    refreshData,
    clearError
  } = useDashboard();

  // Inicializar datos al montar el componente
  useEffect(() => {
    console.log('🔍 Dashboard useEffect - isInitialized:', isInitialized);
    if (!isInitialized) {
      console.log('🚀 Iniciando fetchDashboardData...');
      fetchDashboardData();
    }
  }, [fetchDashboardData, isInitialized]);

  // Mostrar errores en toast
  useEffect(() => {
    if (error) {
      console.error('❌ Dashboard Error:', error);
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Debug: Log de todos los datos del store
  useEffect(() => {
    console.log('📊 Dashboard Store State:', {
      isLoading,
      isInitialized,
      error,
      overview,
      salesByPeriod,
      topProducts,
      topClients,
      paymentMethods,
      afipStats,
      filters
    });
  }, [isLoading, isInitialized, error, overview, salesByPeriod, topProducts, topClients, paymentMethods, afipStats, filters]);

  const handleApplyFilters = async (filtersToApply?: Partial<typeof filters>) => {
    // Combinar filtros actuales con los nuevos
    const updatedFilters = filtersToApply ? { ...filters, ...filtersToApply } : filters;
    console.log('🔄 Aplicando filtros:', updatedFilters);
    
    // Actualizar el store y hacer fetch con los nuevos filtros
    updateFilters(filtersToApply || {});
    await fetchDashboardData(updatedFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleRefresh = async () => {
    console.log('🔄 Refrescando dashboard...');
    await refreshData();
    console.log('✅ Dashboard refrescado');
    toast.success("Dashboard actualizado correctamente");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Panel de control y análisis de ventas
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filtros arriba */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <DashboardFiltersComponent
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          isLoading={isLoading}
        />
      </div>

      {/* Contenido principal abajo */}
      <div className="space-y-6">
        {/* Cards de Overview */}
        <OverviewCards 
          overview={overview}
          isLoading={isLoading}
        />

        {/* Gráfico de Ventas por Período */}
        <SalesByPeriodChart
          salesByPeriod={salesByPeriod}
          isLoading={isLoading}
          period={filters.period || 'day'}
        />

        {/* Rankings de Productos y Clientes */}
        <RankingCards
          topProducts={topProducts}
          topClients={topClients}
          isLoading={isLoading}
        />

        {/* Estadísticas de Métodos de Pago y AFIP */}
        <StatsCards
          paymentMethods={paymentMethods}
          afipStats={afipStats}
          isLoading={isLoading}
        />
      </div>

      {/* Footer con información */}
      {isInitialized && !isLoading && (
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>
            Dashboard actualizado • 
            Período: {filters.dateFrom} al {filters.dateTo} • 
            {overview && (
              <>
                {overview.totalSales} ventas • 
                {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(overview.totalRevenue)} en facturación
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
