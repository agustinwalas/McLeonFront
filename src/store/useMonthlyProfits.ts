// src/store/useMonthlyProfits.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MonthlyProfit, MonthlyProfitsApiResponse } from "@/types/monthlyProfits";

interface MonthlyProfitsState {
  // Data
  monthlyProfits: MonthlyProfit[];

  // UI States
  isLoading: boolean;
  isMigrating: boolean;
  error: string | null;

  // Actions
  fetchMonthlyProfits: (year?: number) => Promise<void>;
  migratePastSales: () => Promise<void>;
  clearError: () => void;
}

const useMonthlyProfits = create<MonthlyProfitsState>((set) => ({
  monthlyProfits: [],
  isLoading: false,
  isMigrating: false,
  error: null,

  fetchMonthlyProfits: async (year?: number) => {
    try {
      set({ isLoading: true, error: null });

      const params: any = {};
      if (year) params.year = year;

      const response = await api.get<MonthlyProfitsApiResponse>("/daily-profits/monthly", {
        params,
      });

      if (response.data.success) {
        set({
          monthlyProfits: response.data.data,
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message || "Error al obtener ganancias mensuales");
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Error desconocido al obtener ganancias mensuales";

      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  migratePastSales: async () => {
    try {
      set({ isMigrating: true, error: null });

      const response = await api.post("/daily-profits/migrate");

      if (response.data.success) {
        toast.success(response.data.message || "Migración completada");
        // Refrescar datos después de migrar
        const profitsResponse = await api.get<MonthlyProfitsApiResponse>("/daily-profits/monthly");
        if (profitsResponse.data.success) {
          set({
            monthlyProfits: profitsResponse.data.data,
            isMigrating: false,
          });
        }
      } else {
        throw new Error(response.data.message || "Error en la migración");
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Error desconocido en la migración";

      set({
        error: errorMessage,
        isMigrating: false,
      });
      toast.error(errorMessage);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useMonthlyProfits;
