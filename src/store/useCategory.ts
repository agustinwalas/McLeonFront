import { create } from "zustand";
import api from "@/lib/axios";
import { 
  ICategory, 
  CategoryCreateInput, 
  CategoryUpdateInput
} from "@/types";
import { AxiosError } from "axios";

interface CategoryStoreState {
  // State
  categories: ICategory[];
  category: ICategory | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  createCategory: (categoryData: CategoryCreateInput) => Promise<void>;
  updateCategory: (id: string, categoryData: CategoryUpdateInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  // Initial state
  categories: [],
  category: null,
  loading: false,
  error: null,
  isInitialized: false,

  // Actions
  fetchCategories: async () => {
    // Solo fetch si no está inicializado
    if (get().isInitialized) return;
    
    set({ loading: true, error: null });
    try {
      const response = await api.get<ICategory[]>('/categories');
      
      // El backend devuelve directamente el array de categorías
      set({ 
        categories: response.data,
        isInitialized: true,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener categorías:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al obtener categorías",
        loading: false 
      });
    }
  },

  fetchCategoryById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ICategory>(`/categories/${id}`);
      
      // El backend devuelve directamente la categoría
      set({ 
        category: response.data,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener categoría:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al obtener categoría",
        loading: false 
      });
    }
  },

  createCategory: async (categoryData: CategoryCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<ICategory>('/categories', categoryData);
      
      // El backend devuelve directamente la categoría creada
      const currentCategories = get().categories;
      set({ 
        categories: [...currentCategories, response.data],
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al crear categoría:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al crear categoría",
        loading: false 
      });
    }
  },

  updateCategory: async (id: string, categoryData: CategoryUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<ICategory>(`/categories/${id}`, categoryData);
      
      // El backend devuelve directamente la categoría actualizada
      const currentCategories = get().categories;
      const updatedCategories = currentCategories.map(category => 
        category._id === id ? response.data : category
      );
      
      set({ 
        categories: updatedCategories,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al actualizar categoría:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al actualizar categoría",
        loading: false 
      });
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      
      // El backend confirma la eliminación, remover del estado
      const currentCategories = get().categories;
      const filteredCategories = currentCategories.filter(category => category._id !== id);
      
      set({ 
        categories: filteredCategories,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al eliminar categoría:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al eliminar categoría",
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ loading }),

  reset: () => set({
    categories: [],
    category: null,
    loading: false,
    error: null,
    isInitialized: false,
  }),
}));
