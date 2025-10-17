// Tipos TypeScript para el Dashboard del frontend

export interface DashboardOverview {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  growthRate: number;
  totalClients: number;
  totalProducts: number;
  period: {
    dateFrom: string;
    dateTo: string;
  };
}

export interface SalesByPeriod {
  period: string; // "2025-10-14" o "2025-10" según granularidad
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesCount: number;
}

export interface ComparativeAnalysis {
  current: {
    period: string;
    totalSales: number;
    totalRevenue: number;
    salesCount: number;
  };
  previous: {
    period: string;
    totalSales: number;
    totalRevenue: number;
    salesCount: number;
  };
  growth: {
    salesGrowth: number; // Porcentaje
    revenueGrowth: number; // Porcentaje
    countGrowth: number; // Porcentaje
  };
}

export interface TopProduct {
  productId: string;
  productName: string;
  productCode?: string;
  totalQuantity: number;
  totalRevenue: number;
  salesCount: number;
  averagePrice: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface TopClient {
  clientId: string;
  clientName: string;
  clientDocument?: string;
  totalRevenue: number;
  salesCount: number;
  averageTicket: number;
  lastSaleDate: string;
}

export interface PaymentMethodStats {
  paymentMethod: string;
  totalRevenue: number;
  salesCount: number;
  percentage: number;
  averageTicket: number;
}

export interface AfipStats {
  comprobanteTipo: number;
  comprobanteName: string;
  totalRevenue: number;
  salesCount: number;
  percentage: number;
  averageTicket: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  totalRevenue: number;
  totalQuantity: number;
  salesCount: number;
  percentage: number;
  averagePrice: number;
}

export interface DashboardResponse {
  overview: DashboardOverview;
  salesByPeriod: SalesByPeriod[];
  topProducts: TopProduct[];
  topClients: TopClient[];
  paymentMethods: PaymentMethodStats[];
  afipStats: AfipStats[];
  comparative?: ComparativeAnalysis;
  generatedAt: string;
  filters: DashboardFilters;
}

export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  productId?: string;
  paymentMethod?: string;
  comprobanteTipo?: number;
  period?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
}

// Tipos para requests de API
export interface DashboardApiResponse {
  success: boolean;
  data: DashboardResponse;
  message?: string;
  error?: string;
}

export interface OverviewApiResponse {
  success: boolean;
  data: DashboardOverview;
  message?: string;
  error?: string;
}

export interface SalesByPeriodApiResponse {
  success: boolean;
  data: SalesByPeriod[];
  message?: string;
  error?: string;
}

export interface TopProductsApiResponse {
  success: boolean;
  data: TopProduct[];
  message?: string;
  error?: string;
}

export interface TopClientsApiResponse {
  success: boolean;
  data: TopClient[];
  message?: string;
  error?: string;
}

export interface PaymentMethodsApiResponse {
  success: boolean;
  data: PaymentMethodStats[];
  message?: string;
  error?: string;
}

export interface AfipStatsApiResponse {
  success: boolean;
  data: AfipStats[];
  message?: string;
  error?: string;
}

export interface ComparativeApiResponse {
  success: boolean;
  data: ComparativeAnalysis;
  message?: string;
  error?: string;
}

// Constantes para validación
export const DASHBOARD_CONSTANTS = {
  MAX_PERIOD_DAYS: 365,
  DEFAULT_PERIOD_DAYS: 30,
  MAX_TOP_ITEMS: 100,
  DEFAULT_TOP_ITEMS: 10,
  PERIOD_TYPES: {
    DAY: 'day',
    WEEK: 'week', 
    MONTH: 'month',
    YEAR: 'year'
  },
  PAYMENT_METHODS: {
    EFECTIVO: 'EFECTIVO',
    TARJETA: 'TARJETA',
    TRANSFERENCIA: 'TRANSFERENCIA',
    CHEQUE: 'CHEQUE'
  }
} as const;

export type PeriodType = typeof DASHBOARD_CONSTANTS.PERIOD_TYPES[keyof typeof DASHBOARD_CONSTANTS.PERIOD_TYPES];
export type PaymentMethodType = typeof DASHBOARD_CONSTANTS.PAYMENT_METHODS[keyof typeof DASHBOARD_CONSTANTS.PAYMENT_METHODS];