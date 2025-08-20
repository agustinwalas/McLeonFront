import { create } from "zustand";
import api from "@/lib/axios";
import { 
  ProductCreateInput, 
  ProductUpdateInput, 
  IProductPopulated,
  IProduct,
  QueryParams 
} from "@/types";
import { AxiosError } from "axios";

interface ProductStoreState {
  // State
  products: IProductPopulated[];
  product: IProductPopulated | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; 
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchProducts: (params?: QueryParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (productData: ProductCreateInput) => Promise<void>;
  updateProduct: (id: string, productData: ProductUpdateInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void; 
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  // Initial state
  products: [],
  product: null,
  loading: false,
  error: null,
  isInitialized: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Actions
  fetchProducts: async (params?: QueryParams) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.order) queryParams.append('order', params.order);

      const url = `/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get<IProductPopulated[]>(url);
      
      // El backend devuelve directamente el array de productos
      set({ 
        products: response.data,
        pagination: undefined, // No hay paginación por ahora
        isInitialized: true,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener productos:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al obtener productos",
        loading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<IProductPopulated>(`/products/${id}`);
      
      // Para fetchById asumimos que el backend devuelve el producto poblado
      set({ 
        product: response.data,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener producto:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al obtener producto",
        loading: false 
      });
    }
  },

  createProduct: async (productData: ProductCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<IProduct>('/products', productData);
      
      // El backend devuelve el producto con category como ID
      // Necesitamos poblarlo localmente
      const { useCategoryStore } = await import('./useCategory');
      const categoryStore = useCategoryStore.getState();
      
      // Asegurarse de que las categorías estén cargadas
      if (!categoryStore.isInitialized) {
        await categoryStore.fetchCategories();
      }
      
      const categories = useCategoryStore.getState().categories;
      const category = categories.find(cat => cat._id === response.data.category);
      
      const populatedProduct: IProductPopulated = {
        ...response.data,
        category: category || {
          _id: response.data.category as string,
          name: 'Categoría no encontrada',
          active: true
        }
      };
      
      const currentProducts = get().products;
      set({ 
        products: [...currentProducts, populatedProduct],
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al crear producto:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al crear producto",
        loading: false 
      });
    }
  },

  updateProduct: async (id: string, productData: ProductUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<IProduct>(`/products/${id}`, productData);
      
      // El backend devuelve el producto con category como ID
      // Necesitamos poblarlo localmente
      const { useCategoryStore } = await import('./useCategory');
      const categoryStore = useCategoryStore.getState();
      
      // Asegurarse de que las categorías estén cargadas
      if (!categoryStore.isInitialized) {
        await categoryStore.fetchCategories();
      }
      
      const categories = useCategoryStore.getState().categories;
      const category = categories.find(cat => cat._id === response.data.category);
      
      const populatedProduct: IProductPopulated = {
        ...response.data,
        category: category || {
          _id: response.data.category as string,
          name: 'Categoría no encontrada',
          active: true
        }
      };
      
      const currentProducts = get().products;
      const updatedProducts = currentProducts.map(product => 
        product._id === id ? populatedProduct : product
      );
      
      set({ 
        products: updatedProducts,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al actualizar producto:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al actualizar producto",
        loading: false 
      });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      
      // El backend confirma la eliminación, remover del estado
      const currentProducts = get().products;
      const filteredProducts = currentProducts.filter(product => product._id !== id);
      
      set({ 
        products: filteredProducts,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al eliminar producto:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al eliminar producto",
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ loading }),

  reset: () => set({
    products: [],
    product: null,
    loading: false,
    error: null,
    isInitialized: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
  }),
}));
