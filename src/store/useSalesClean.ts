// src/store/useSales.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { ICreateSale, IUpdateSale, ISalePopulated } from "@/types/sale";

interface SalesState {
  sales: ISalePopulated[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Actions
  fetchSales: (page?: number, filters?: Record<string, string>) => Promise<void>;
  getSaleById: (id: string) => Promise<ISalePopulated | null>;
  createSale: (saleData: ICreateSale) => Promise<ISalePopulated>;
  updateSale: (id: string, saleData: IUpdateSale) => Promise<ISalePopulated>;
  deleteSale: (id: string) => Promise<void>;
  getSalesStats: (filters?: Record<string, string>) => Promise<unknown>;
  clearError: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,

  fetchSales: async (page = 1, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...filters
      });

      const response = await api.get(`/sales?${params}`);
      const { sales, pagination } = response.data;

      set({
        sales,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        loading: false
      });
    } catch {
      set({
        error: "Error al cargar las ventas",
        loading: false
      });
    }
  },

  getSaleById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/sales/${id}`);
      set({ loading: false });
      return response.data;
    } catch {
      set({
        error: "Error al obtener la venta",
        loading: false
      });
      return null;
    }
  },

  createSale: async (saleData: ICreateSale) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/sales", saleData);
      const newSale = response.data;

      // Agregar la nueva venta al inicio de la lista
      const currentSales = get().sales;
      set({
        sales: [newSale, ...currentSales],
        loading: false
      });

      return newSale;
    } catch (error) {
      set({
        error: "Error al crear la venta",
        loading: false
      });
      throw error;
    }
  },

  updateSale: async (id: string, saleData: IUpdateSale) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/sales/${id}`, saleData);
      const updatedSale = response.data;

      const currentSales = get().sales;
      const updatedSales = currentSales.map(sale => 
        sale._id === id ? updatedSale : sale
      );

      set({
        sales: updatedSales,
        loading: false
      });

      return updatedSale;
    } catch {
      set({
        error: "Error al actualizar la venta",
        loading: false
      });
      throw new Error("Error al actualizar la venta");
    }
  },

  deleteSale: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/sales/${id}`);

      const currentSales = get().sales;
      const filteredSales = currentSales.filter(sale => sale._id !== id);

      set({
        sales: filteredSales,
        loading: false
      });
    } catch {
      set({
        error: "Error al eliminar la venta",
        loading: false
      });
      throw new Error("Error al eliminar la venta");
    }
  },

  getSalesStats: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/sales/stats?${params}`);
      set({ loading: false });
      return response.data;
    } catch {
      set({
        error: "Error al obtener estadísticas",
        loading: false
      });
      throw new Error("Error al obtener estadísticas");
    }
  },

  clearError: () => set({ error: null })
}));

export default useSalesStore;
