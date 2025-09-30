// src/store/useShopifyCollection.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { 
  IShopifyCollection, 
  ShopifyCollectionCreateInput, 
  ShopifyCollectionFromCategoryInput,
  ShopifyCollectionSyncResponse
} from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ShopifyCollectionStoreState {
  // State
  collections: IShopifyCollection[];
  collection: IShopifyCollection | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  fetchCollections: () => Promise<void>;
  fetchCollectionById: (id: string) => Promise<void>;
  createManualCollection: (collectionData: ShopifyCollectionCreateInput) => Promise<void>;
  updateCollection: (id: string, updateData: { collectionName?: string; description?: string; isActive?: boolean }) => Promise<void>;
  createCollectionFromCategory: (data: ShopifyCollectionFromCategoryInput) => Promise<void>;
  syncAllCategories: () => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  deleteCollectionCompletely: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const handleApiError = (error: unknown, defaultMessage: string) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return message;
  }
  toast.error(defaultMessage);
  return defaultMessage;
};

export const useShopifyCollectionStore = create<ShopifyCollectionStoreState>((set, get) => ({
  // Initial state
  collections: [],
  collection: null,
  loading: false,
  error: null,
  isInitialized: false,

  // Actions
  fetchCollections: async () => {
    // Solo fetch si no está inicializado
    if (get().isInitialized) return;
    
    set({ loading: true, error: null });
    try {
      const response = await api.get<{
        success: boolean;
        data: IShopifyCollection[];
        message: string;
      }>('/shopify-collections');
      
      set({ 
        collections: response.data.data,
        isInitialized: true,
        loading: false,
        error: null
      });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al obtener las collections');
      set({ 
        error: errorMessage,
        loading: false
      });
    }
  },

  fetchCollectionById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{
        success: boolean;
        data: IShopifyCollection;
        message: string;
      }>(`/shopify-collections/${id}`);
      
      set({ 
        collection: response.data.data,
        loading: false,
        error: null
      });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al obtener la collection');
      set({ 
        error: errorMessage,
        loading: false
      });
    }
  },

  createManualCollection: async (collectionData: ShopifyCollectionCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<{
        success: boolean;
        data: IShopifyCollection;
        message: string;
      }>('/shopify-collections/manual', collectionData);
      
      const newCollection = response.data.data;
      
      set(state => ({ 
        collections: [...state.collections, newCollection],
        loading: false,
        error: null
      }));
      
      toast.success('Collection creada exitosamente');
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al crear la collection');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  updateCollection: async (id: string, updateData: { collectionName?: string; description?: string; isActive?: boolean; imageUrl?: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<{
        success: boolean;
        data: IShopifyCollection;
        message: string;
      }>(`/shopify-collections/${id}`, updateData);
      
      const updatedCollection = response.data.data;
      
      set(state => ({ 
        collections: state.collections.map(collection => 
          collection._id === id ? updatedCollection : collection
        ),
        collection: state.collection && state.collection._id === id ? updatedCollection : state.collection,
        loading: false,
        error: null
      }));
      
      toast.success('Collection actualizada exitosamente');
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al actualizar la collection');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  createCollectionFromCategory: async (data: ShopifyCollectionFromCategoryInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<{
        success: boolean;
        data: IShopifyCollection;
        message: string;
      }>(`/shopify-collections/from-category/${data.categoryId}`);
      
      const newCollection = response.data.data;
      
      set(state => ({ 
        collections: [...state.collections, newCollection],
        loading: false,
        error: null
      }));
      
      toast.success('Collection de categoría creada exitosamente');
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al crear collection desde categoría');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  syncAllCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<{
        success: boolean;
        data: ShopifyCollectionSyncResponse;
        message: string;
      }>('/shopify-collections/sync-categories');
      
      const result = response.data.data;
      
      // Refresh collections after sync
      await get().fetchCollections();
      
      toast.success(`Sincronización completada: ${result.success} collections creadas`);
      
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} errores durante la sincronización`);
      }
      
      set({ loading: false, error: null });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al sincronizar categorías');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  deleteCollection: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/shopify-collections/${id}`);
      
      set(state => ({
        collections: state.collections.filter(collection => collection._id !== id),
        loading: false,
        error: null
      }));
      
      toast.success('Collection eliminada exitosamente');
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al eliminar la collection');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  deleteCollectionCompletely: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/shopify-collections/${id}/complete`);
      
      set(state => ({
        collections: state.collections.filter(collection => collection._id !== id),
        loading: false,
        error: null
      }));
      
      toast.success('Collection eliminada');
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error al eliminar la collection completamente');
      set({ 
        error: errorMessage,
        loading: false
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  reset: () => {
    set({
      collections: [],
      collection: null,
      loading: false,
      error: null,
      isInitialized: false
    });
  }
}));