import { create } from "zustand";
import api from "@/lib/axios";
import { 
  ISupplier, 
  SupplierCreateInput, 
  SupplierUpdateInput
} from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

type AssociatedSupplier = ISupplier | string;

interface SupplierStoreState {
  // State
  suppliers: ISupplier[];
  supplier: ISupplier | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  fetchSuppliers: () => Promise<void>;
  fetchSupplierById: (id: string) => Promise<void>;
  createSupplier: (supplierData: SupplierCreateInput) => Promise<void>;
  updateSupplier: (id: string, supplierData: SupplierUpdateInput) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  // ✅ Función utility con tipo específico
  extractSupplierIds: (associatedSuppliers: AssociatedSupplier[]) => string[];
}

export const useSupplierStore = create<SupplierStoreState>((set, get) => ({
  // Initial state
  suppliers: [],
  supplier: null,
  loading: false,
  error: null,
  isInitialized: false,

  // Actions
  fetchSuppliers: async () => {
    // Solo fetch si no está inicializado
    if (get().isInitialized) return;
    
    set({ loading: true, error: null });
    try {
      const response = await api.get<ISupplier[]>('/suppliers');
      
      // El backend devuelve directamente el array de proveedores
      set({ 
        suppliers: response.data,
        isInitialized: true,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener proveedores:", error);
      const errorMessage = axiosError.response?.data?.message || "Error al obtener proveedores";
      toast.error(errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  fetchSupplierById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ISupplier>(`/suppliers/${id}`);
      
      // El backend devuelve directamente el proveedor
      set({ 
        supplier: response.data,
        loading: false 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al obtener proveedor:", error);
      set({ 
        error: axiosError.response?.data?.message || "Error al obtener proveedor",
        loading: false 
      });
    }
  },

  createSupplier: async (supplierData: SupplierCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<ISupplier>('/suppliers', supplierData);
      
      // El backend devuelve directamente el proveedor creado
      const currentSuppliers = get().suppliers;
      set({ 
        suppliers: [...currentSuppliers, response.data],
        loading: false 
      });
      
      toast.success(`Proveedor "${response.data.name}" creado exitosamente`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al crear proveedor:", error);
      const errorMessage = axiosError.response?.data?.message || "Error al crear proveedor";
      toast.error(errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  updateSupplier: async (id: string, supplierData: SupplierUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<ISupplier>(`/suppliers/${id}`, supplierData);
      
      // El backend devuelve directamente el proveedor actualizado
      const currentSuppliers = get().suppliers;
      const updatedSuppliers = currentSuppliers.map(supplier => 
        supplier._id === id ? response.data : supplier
      );
      
      set({ 
        suppliers: updatedSuppliers,
        loading: false 
      });
      
      toast.success(`Proveedor "${response.data.name}" actualizado exitosamente`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al actualizar proveedor:", error);
      const errorMessage = axiosError.response?.data?.message || "Error al actualizar proveedor";
      toast.error(errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  deleteSupplier: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Obtener el nombre del proveedor antes de eliminarlo para el toast
      const supplierToDelete = get().suppliers.find(supplier => supplier._id === id);
      const supplierName = supplierToDelete?.name || "Proveedor";
      
      await api.delete(`/suppliers/${id}`);
      
      // El backend confirma la eliminación, remover del estado
      const currentSuppliers = get().suppliers;
      const filteredSuppliers = currentSuppliers.filter(supplier => supplier._id !== id);
      
      set({ 
        suppliers: filteredSuppliers,
        loading: false 
      });
      
      toast.success(`Proveedor "${supplierName}" eliminado exitosamente`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error al eliminar proveedor:", error);
      const errorMessage = axiosError.response?.data?.message || "Error al eliminar proveedor";
      toast.error(errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ loading }),

  // ✅ Función con tipos específicos
  extractSupplierIds: (associatedSuppliers: AssociatedSupplier[]): string[] => {
    if (!associatedSuppliers || !Array.isArray(associatedSuppliers)) {
      console.log("⚠️ No hay proveedores asociados o no es array");
      return [];
    }

    const ids = associatedSuppliers
      .map((supplier: AssociatedSupplier): string | null => {
        // ✅ Si es un objeto ISupplier con _id
        if (typeof supplier === 'object' && supplier !== null && '_id' in supplier) {
          return supplier._id;
        }
        // ✅ Si ya es un string (ID)
        if (typeof supplier === 'string') {
          return supplier;
        }
        // ✅ Casos inválidos
        console.warn("⚠️ Proveedor asociado inválido:", supplier);
        return null;
      })
      .filter((id): id is string => id !== null); // ✅ Type guard para filtrar nulls

    console.log("✅ IDs extraídos de proveedores:", ids);
    return ids;
  },

  reset: () => set({
    suppliers: [],
    supplier: null,
    loading: false,
    error: null,
    isInitialized: false,
  }),
}));

// ✅ Exportar el tipo para uso en otros archivos
export type { AssociatedSupplier };
