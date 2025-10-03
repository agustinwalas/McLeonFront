export interface ISupplier {
  _id: string;
  name: string;
  razonSocial: string;
  phone: string;
  email: string;
  location: string;
  suppliedProducts: string[]; // Product IDs as strings
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new supplier (without _id)
export interface SupplierCreateInput {
  name: string;
  razonSocial: string;
  phone: string;
  email: string;
  location: string;
  suppliedProducts?: string[];
}

// For updating a supplier
export interface SupplierUpdateInput {
  name?: string;
  razonSocial?: string;
  phone?: string;
  email?: string;
  location?: string;
  suppliedProducts?: string[];
}

// Populated supplier with product details
export interface ISupplierPopulated extends Omit<ISupplier, 'suppliedProducts'> {
  suppliedProducts: {
    _id: string;
    name: string;
    productCode: string;
  }[];
}

// Response for price update
export interface UpdatePricesResponse {
  message: string;
  supplier: string;
  productsUpdated: number;
  priceChange: string;
  percentage: number;
  updatedProducts: {
    id: string;
    name: string;
    productCode: string;
    newPrices: {
      purchaseCost: number;
      wholesalePrice: number;
      retailPrice: number;
    };
  }[];
}

// ==========================================
// SUPPLIER INVOICES TYPES
// ==========================================

// Factura de proveedor
export interface ISupplierInvoice {
  _id: string;
  supplierId: string;
  businessName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  supplier?: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Para crear una nueva factura de proveedor
export interface SupplierInvoiceCreateInput {
  supplierId: string;
  businessName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
}

// Para actualizar una factura de proveedor
export interface SupplierInvoiceUpdateInput {
  businessName?: string;
  invoiceNumber?: string;
  date?: string;
  amount?: number;
}

// Estadísticas de facturas de proveedor
export interface SupplierInvoiceStats {
  general: {
    totalInvoices: number;
    totalAmount: number;
    averageAmount: number;
    minAmount: number;
    maxAmount: number;
    lastInvoiceDate: string | null;
    firstInvoiceDate: string | null;
  };
  monthly: Array<{
    _id: { year: number; month: number };
    count: number;
    totalAmount: number;
  }>;
}

// Filtros para búsqueda de facturas
export interface SupplierInvoiceFilters {
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Respuesta de la lista de facturas con paginación
export interface SupplierInvoiceListResponse {
  invoices: ISupplierInvoice[];
  currentPage: number;
  totalPages: number;
  totalInvoices: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
