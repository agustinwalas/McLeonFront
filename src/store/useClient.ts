import { create } from "zustand";
import { IClient, ClientCreateInput } from "@/types/client";
import axios from "@/lib/axios";

interface ClientStore {
  clients: IClient[];
  currentClient: IClient | null; // ✅ Cliente actual para detalles
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  fetchClients: () => Promise<void>;
  fetchClient: (id: string) => Promise<IClient | null>; // ✅ Nueva función
  createClient: (clientData: ClientCreateInput) => Promise<IClient>; // ✅ Devolver cliente creado
  updateClient: (id: string, client: IClient) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentClient: () => void; // ✅ Limpiar cliente actual
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  currentClient: null, 
  loading: false,
  error: null,
  isInitialized: false,
  
  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/clients");
      console.log("✅ Clientes cargados:", response.data.length);
      set({ 
        clients: response.data, 
        loading: false, 
        isInitialized: true,
        error: null 
      });
    } catch (error: unknown) {
      console.error("❌ Error fetching clients:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al cargar clientes";
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },
  
  // ✅ Nueva función para obtener cliente por ID
  fetchClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      console.log("🔍 Buscando cliente:", id);
      
      // Primero intentar encontrar en la lista local
      const existingClient = get().clients.find(client => client._id === id);
      if (existingClient) {
        console.log("✅ Cliente encontrado en cache:", existingClient.name);
        set({ 
          currentClient: existingClient, 
          loading: false 
        });
        return existingClient;
      }
      
      // Si no está en cache, hacer request al backend
      console.log("🌐 Obteniendo cliente del servidor...");
      const response = await axios.get(`/clients/${id}`);
      const client = response.data;
      
      console.log("✅ Cliente obtenido del servidor:", client.name);
      
      set({ 
        currentClient: client,
        loading: false,
        error: null
      });
      
      return client;
    } catch (error: unknown) {
      console.error("❌ Error fetching client:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al cargar cliente";
      set({ 
        error: errorMessage,
        loading: false,
        currentClient: null
      });
      return null;
    }
  },
  
  createClient: async (clientData: ClientCreateInput) => {
    set({ loading: true, error: null });
    try {
      console.log("🚀 Creando cliente:", clientData);
      const response = await axios.post("/clients", clientData);
      const newClient = response.data;
      
      console.log("✅ Cliente creado:", newClient);
      
      set(state => ({ 
        clients: [newClient, ...state.clients], // ✅ Agregar al inicio
        loading: false,
        error: null
      }));
      
      return newClient; // ✅ Devolver el cliente creado
    } catch (error: unknown) {
      console.error("❌ Error creating client:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al crear cliente";
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw error;
    }
  },
  
  updateClient: async (id: string, clientData: IClient) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/clients/${id}`, clientData);
      const updatedClient = response.data;
      
      set(state => ({ 
        clients: state.clients.map(client => 
          client._id === id ? updatedClient : client
        ),
        currentClient: state.currentClient?._id === id ? updatedClient : state.currentClient,
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
        currentClient: state.currentClient?._id === id ? null : state.currentClient,
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
  
  clearError: () => set({ error: null }),
  
  // ✅ Limpiar cliente actual
  clearCurrentClient: () => set({ currentClient: null })
}));
