// Category types
export type {
  ICategory,
  CategoryCreateInput,
  CategoryUpdateInput
} from './category';

// Client types
export type {
  IClient,
  ClientCreateInput,
} from './client';

// Export enums separately for value access
export { TaxCondition, DocumentType } from './client';

// Product types
export type {
  IProduct,
  ProductCreateInput,
  ProductUpdateInput,
  IProductPopulated,
} from './product';

// Supplier types
export type {
  ISupplier,
  SupplierCreateInput,
  SupplierUpdateInput,
  ISupplierPopulated,
  UpdatePricesResponse,
  // Supplier Invoice types
  ISupplierInvoice,
  SupplierInvoiceCreateInput,
  SupplierInvoiceUpdateInput,
  SupplierInvoiceStats,
  SupplierInvoiceFilters,
  SupplierInvoiceListResponse
} from './supplier';

// User types
export type {
  IUser,
  UserPayload,
  UserCreateInput,
  UserUpdateInput,
  AuthRequest
} from './user';

// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common query params for API calls
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Dashboard types
export type {
  DashboardOverview,
  SalesByPeriod,
  ComparativeAnalysis,
  TopProduct,
  TopClient,
  PaymentMethodStats,
  AfipStats,
  CategoryStats,
  DashboardResponse,
  DashboardFilters,
  DashboardApiResponse,
  OverviewApiResponse,
  SalesByPeriodApiResponse,
  TopProductsApiResponse,
  TopClientsApiResponse,
  PaymentMethodsApiResponse,
  AfipStatsApiResponse,
  ComparativeApiResponse,
  PeriodType,
  PaymentMethodType
} from './dashboard';

export { DASHBOARD_CONSTANTS } from './dashboard';

// Error response type
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}
