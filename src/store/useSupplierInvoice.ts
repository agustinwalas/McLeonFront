import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";
import { 
  ISupplier,
  ISupplierInvoice,
  SupplierInvoiceCreateInput,
  SupplierInvoiceUpdateInput,
  SupplierInvoiceStats,
  SupplierInvoiceFilters,
  SupplierInvoiceListResponse
} from "@/types";

interface SupplierInvoiceStoreState {
  // State
  invoices: ISupplierInvoice[];
  invoice: ISupplierInvoice | null;
  loading: boolean;
  error: string | null;
  stats: SupplierInvoiceStats | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalInvoices: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // Actions
  fetchInvoices: (filters?: SupplierInvoiceFilters) => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (invoiceData: SupplierInvoiceCreateInput) => Promise<void>;
  updateInvoice: (id: string, invoiceData: SupplierInvoiceUpdateInput) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  fetchInvoiceStats: (supplierId: string, year?: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  
  // Utility functions for forms
  getSupplierBusinessName: (suppliers: ISupplier[], supplierId: string) => string;
}

export const useSupplierInvoiceStore = create<SupplierInvoiceStoreState>((set) => ({
  // Initial state
  invoices: [],
  invoice: null,
  loading: false,
  error: null,
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalInvoices: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Actions
  fetchInvoices: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters.supplierId) params.append('supplierId', filters.supplierId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/supplier-invoices?${params.toString()}`);
      const data: SupplierInvoiceListResponse = response.data;
      
      set({ 
        invoices: data.invoices,
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalInvoices: data.totalInvoices,
          hasNextPage: data.hasNextPage,
          hasPrevPage: data.hasPrevPage,
        },
        loading: false 
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al obtener facturas";
      set({ 
        error: errorMessage, 
        loading: false,
        invoices: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalInvoices: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      });
      toast.error(errorMessage);
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/supplier-invoices/${id}`);
      set({ invoice: response.data, loading: false });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al obtener factura";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createInvoice: async (invoiceData: SupplierInvoiceCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/supplier-invoices', invoiceData);
      
      // Agregar la nueva factura al estado actual
      set(state => ({ 
        invoices: [response.data, ...state.invoices],
        loading: false 
      }));
      
      toast.success("Factura creada exitosamente");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al crear factura";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateInvoice: async (id: string, invoiceData: SupplierInvoiceUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/supplier-invoices/${id}`, invoiceData);
      
      // Actualizar la factura en el estado
      set(state => ({
        invoices: state.invoices.map(invoice => 
          invoice._id === id ? response.data : invoice
        ),
        invoice: state.invoice?._id === id ? response.data : state.invoice,
        loading: false
      }));
      
      toast.success("Factura actualizada exitosamente");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al actualizar factura";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/supplier-invoices/${id}`);
      
      // Remover la factura del estado
      set(state => ({
        invoices: state.invoices.filter(invoice => invoice._id !== id),
        invoice: state.invoice?._id === id ? null : state.invoice,
        loading: false
      }));
      
      toast.success("Factura eliminada exitosamente");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al eliminar factura";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchInvoiceStats: async (supplierId: string, year?: string) => {
    set({ loading: true, error: null });
    try {
      const params = year ? `?year=${year}` : '';
      const response = await api.get(`/supplier-invoices/stats/${supplierId}${params}`);
      set({ stats: response.data, loading: false });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al obtener estadísticas";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  reset: () => set({
    invoices: [],
    invoice: null,
    loading: false,
    error: null,
    stats: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalInvoices: 0,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }),

  // Utility functions for forms
  getSupplierBusinessName: (suppliers: ISupplier[], supplierId: string) => {
    const selectedSupplier = suppliers.find((s: ISupplier) => s._id === supplierId);
    return selectedSupplier ? selectedSupplier.name : '';
  }
}));