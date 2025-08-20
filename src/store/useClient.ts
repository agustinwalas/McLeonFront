import { create } from "zustand";
import { IClient, ClientCreateInput, ClientUpdateInput } from "@/types/client";
import axios from "@/lib/axios";

interface ClientStore {
  clients: IClient[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  fetchClients: () => Promise<void>;
  createClient: (client: ClientCreateInput) => Promise<void>;
  updateClient: (id: string, client: ClientUpdateInput) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  loading: false,
  error: null,
  isInitialized: false,
  
  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/clients");
      set({ 
        clients: response.data, 
        loading: false, 
        isInitialized: true,
        error: null 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar clientes";
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },
  
  createClient: async (clientData: ClientCreateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/clients", clientData);
      const newClient = response.data;
      
      set(state => ({ 
        clients: [...state.clients, newClient],
        loading: false,
        error: null
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear cliente";
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },
  
  updateClient: async (id: string, clientData: ClientUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/clients/${id}`, clientData);
      const updatedClient = response.data;
      
      set(state => ({ 
        clients: state.clients.map(client => 
          client._id === id ? updatedClient : client
        ),
        loading: false,
        error: null
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar cliente";
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },
  
  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/clients/${id}`);
      
      set(state => ({ 
        clients: state.clients.filter(client => client._id !== id),
        loading: false,
        error: null
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar cliente";
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));
