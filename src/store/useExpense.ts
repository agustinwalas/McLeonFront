import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";
import { IExpense, ExpenseCreateInput, ExpenseUpdateInput } from "@/types/expense";

interface ExpenseState {
  expenses: IExpense[];
  loading: boolean;
  error: string | null;

  fetchExpenses: () => Promise<void>;
  createExpense: (data: ExpenseCreateInput) => Promise<void>;
  updateExpense: (id: string, data: ExpenseUpdateInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/expenses");
      set({ expenses: response.data, loading: false });
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Error al obtener gastos";
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  createExpense: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/expenses", data);
      set((state) => ({ expenses: [response.data, ...state.expenses], loading: false }));
      toast.success("Gasto creado exitosamente");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Error al crear gasto";
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  updateExpense: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/expenses/${id}`, data);
      set((state) => ({
        expenses: state.expenses.map((e) => (e._id === id ? response.data : e)),
        loading: false,
      }));
      toast.success("Gasto actualizado exitosamente");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Error al actualizar gasto";
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/expenses/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id),
        loading: false,
      }));
      toast.success("Gasto eliminado exitosamente");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Error al eliminar gasto";
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
