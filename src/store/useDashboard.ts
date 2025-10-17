import { create } from "zustand";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  DashboardResponse,
  DashboardOverview,
  SalesByPeriod,
  TopProduct,
  TopClient,
  PaymentMethodStats,
  AfipStats,
  ComparativeAnalysis,
  DashboardFilters,
  DashboardApiResponse,
  OverviewApiResponse,
  SalesByPeriodApiResponse,
  TopProductsApiResponse,
  TopClientsApiResponse,
  PaymentMethodsApiResponse,
  AfipStatsApiResponse,
  ComparativeApiResponse,
  DASHBOARD_CONSTANTS
} from "@/types/dashboard";

interface DashboardState {
  // Data
  dashboardData: DashboardResponse | null;
  overview: DashboardOverview | null;
  salesByPeriod: SalesByPeriod[];
  topProducts: TopProduct[];
  topClients: TopClient[];
  paymentMethods: PaymentMethodStats[];
  afipStats: AfipStats[];
  comparative: ComparativeAnalysis | null;

  // Filters
  filters: DashboardFilters;

  // UI States
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions para obtener datos completos
  fetchDashboardData: (customFilters?: DashboardFilters) => Promise<void>;

  // Actions para endpoints específicos
  fetchOverview: (customFilters?: DashboardFilters) => Promise<void>;
  fetchSalesByPeriod: (customFilters?: DashboardFilters) => Promise<void>;
  fetchTopProducts: (customFilters?: DashboardFilters) => Promise<void>;
  fetchTopClients: (customFilters?: DashboardFilters) => Promise<void>;
  fetchPaymentMethods: (customFilters?: DashboardFilters) => Promise<void>;
  fetchAfipStats: (customFilters?: DashboardFilters) => Promise<void>;
  fetchComparative: (customFilters?: DashboardFilters) => Promise<void>;

  // Actions para filtros
  updateFilters: (newFilters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  setDateRange: (dateFrom: string, dateTo: string) => void;
  setPeriodType: (period: 'day' | 'week' | 'month' | 'year') => void;

  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  refreshData: () => Promise<void>;
}

const getDefaultFilters = (): DashboardFilters => {
  const today = new Date();
  
  // Primer día del mes actual
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    dateFrom: firstDayOfMonth.toISOString().split('T')[0],
    dateTo: today.toISOString().split('T')[0],
    period: 'day',
    limit: DASHBOARD_CONSTANTS.DEFAULT_TOP_ITEMS
  };
};

const useDashboard = create<DashboardState>((set, get) => ({
  // Initial state
  dashboardData: null,
  overview: null,
  salesByPeriod: [],
  topProducts: [],
  topClients: [],
  paymentMethods: [],
  afipStats: [],
  comparative: null,
  filters: getDefaultFilters(),
  isLoading: false,
  isInitialized: false,
  error: null,

  // Obtener datos completos del dashboard
  fetchDashboardData: async (customFilters?: DashboardFilters) => {
    try {
      console.log('🚀 fetchDashboardData iniciado');
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      console.log('📋 Filtros a usar:', filtersToUse);
      
      console.log('🌐 Haciendo request a /dashboard...');
      const response = await api.get<DashboardApiResponse>("/dashboard", {
        params: filtersToUse
      });
      console.log('📊 Response recibida:', response.data);

      if (response.data.success) {
        console.log('✅ Response exitosa, seteando datos en store...');
        console.log('📈 Overview:', response.data.data.overview);
        console.log('📊 Sales by period:', response.data.data.salesByPeriod);
        console.log('🏆 Top products:', response.data.data.topProducts);
        console.log('👥 Top clients:', response.data.data.topClients);
        
        set({
          dashboardData: response.data.data,
          overview: response.data.data.overview,
          salesByPeriod: response.data.data.salesByPeriod,
          topProducts: response.data.data.topProducts,
          topClients: response.data.data.topClients,
          paymentMethods: response.data.data.paymentMethods,
          afipStats: response.data.data.afipStats,
          comparative: response.data.data.comparative || null,
          filters: response.data.data.filters,
          isInitialized: true,
          isLoading: false
        });
        
        console.log('✅ Store actualizado exitosamente');
      } else {
        console.error('❌ Response no exitosa:', response.data.message);
        throw new Error(response.data.message || "Error al obtener datos del dashboard");
      }
    } catch (error) {
      console.error('❌ Error en fetchDashboardData:', error);
      
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener datos del dashboard";
      
      console.error('📝 Error message:', errorMessage);
      console.error('🔍 Error details:', {
        status: error instanceof AxiosError ? error.response?.status : 'N/A',
        statusText: error instanceof AxiosError ? error.response?.statusText : 'N/A',
        data: error instanceof AxiosError ? error.response?.data : 'N/A'
      });
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener solo estadísticas generales
  fetchOverview: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<OverviewApiResponse>("/dashboard/overview", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          overview: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener estadísticas generales");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener estadísticas generales";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener ventas por período
  fetchSalesByPeriod: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<SalesByPeriodApiResponse>("/dashboard/sales-by-period", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          salesByPeriod: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener ventas por período");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener ventas por período";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener top productos
  fetchTopProducts: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<TopProductsApiResponse>("/dashboard/top-products", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          topProducts: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener top productos");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener top productos";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener top clientes
  fetchTopClients: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<TopClientsApiResponse>("/dashboard/top-clients", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          topClients: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener top clientes");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener top clientes";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener estadísticas de métodos de pago
  fetchPaymentMethods: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<PaymentMethodsApiResponse>("/dashboard/payment-methods", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          paymentMethods: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener estadísticas de métodos de pago");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener estadísticas de métodos de pago";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener estadísticas AFIP
  fetchAfipStats: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<AfipStatsApiResponse>("/dashboard/afip-stats", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          afipStats: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener estadísticas AFIP");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener estadísticas AFIP";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Obtener análisis comparativo
  fetchComparative: async (customFilters?: DashboardFilters) => {
    try {
      set({ isLoading: true, error: null });

      const filtersToUse = customFilters || get().filters;
      
      const response = await api.get<ComparativeApiResponse>("/dashboard/comparative", {
        params: filtersToUse
      });

      if (response.data.success) {
        set({
          comparative: response.data.data,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Error al obtener análisis comparativo");
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error 
        ? error.message 
        : "Error desconocido al obtener análisis comparativo";
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  // Actualizar filtros
  updateFilters: (newFilters: Partial<DashboardFilters>) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
  },

  // Resetear filtros a valores por defecto
  resetFilters: () => {
    set({ filters: getDefaultFilters() });
  },

  // Establecer rango de fechas
  setDateRange: (dateFrom: string, dateTo: string) => {
    set(state => ({
      filters: {
        ...state.filters,
        dateFrom,
        dateTo
      }
    }));
  },

  // Establecer tipo de período
  setPeriodType: (period: 'day' | 'week' | 'month' | 'year') => {
    set(state => ({
      filters: {
        ...state.filters,
        period
      }
    }));
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Establecer loading
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Resetear estado completo
  reset: () => {
    set({
      dashboardData: null,
      overview: null,
      salesByPeriod: [],
      topProducts: [],
      topClients: [],
      paymentMethods: [],
      afipStats: [],
      comparative: null,
      filters: getDefaultFilters(),
      isLoading: false,
      isInitialized: false,
      error: null
    });
  },

  // Refrescar datos usando filtros actuales
  refreshData: async () => {
    const { fetchDashboardData, filters } = get();
    await fetchDashboardData(filters);
  }
}));

export default useDashboard;