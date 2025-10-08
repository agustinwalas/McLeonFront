// src/store/useAfip.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AfipCatalogItem, AfipUltimoAutorizado, AfipVoucherCreateInput, AfipVoucherResponse } from "@/types/afip";

/** ---------- Tipos AFIP (ajustá si ya los tenés en /types) ---------- */


/** ---------- Store ---------- */

interface AfipStoreState {
  // State
  loading: boolean;
  error: string | null;

  // Últimas operaciones / caché simple
  lastVoucher: AfipVoucherResponse | null;
  lastUltimo: AfipUltimoAutorizado | null;

  // Catálogos (opcionales)
  cbteTipos: AfipCatalogItem[];     // tipos de comprobante
  docTipos: AfipCatalogItem[];      // tipos de documento
  ivaAlicuotas: AfipCatalogItem[];  // alícuotas IVA
  monedas: AfipCatalogItem[];       // monedas
  isInitialized: boolean;

  // Actions
  createVoucher: (data: AfipVoucherCreateInput, onSuccess?: (response: AfipVoucherResponse) => void) => Promise<AfipVoucherResponse | void>;
  fetchUltimoAutorizado: (ptoVta: number, cbteTipo: number) => Promise<AfipUltimoAutorizado | void>;
  fetchCbteTipos: () => Promise<void>;
  fetchDocTipos: () => Promise<void>;
  fetchIvaAlicuotas: () => Promise<void>;
  fetchMonedas: () => Promise<void>;

  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAfipStore = create<AfipStoreState>((set) => ({
  // Initial
  loading: false,
  error: null,

  lastVoucher: null,
  lastUltimo: null,

  cbteTipos: [],
  docTipos: [],
  ivaAlicuotas: [],
  monedas: [],
  isInitialized: false,

  /** Crear comprobante (FECAESolicitar) */
  createVoucher: async (data: AfipVoucherCreateInput, onSuccess?: (response: AfipVoucherResponse) => void) => {
    set({ loading: true, error: null });
    try {
      
      // Ajustá el endpoint a tu backend
      const resp = await api.post<AfipVoucherResponse>("/afip/vouchers", data);
      
      set({
        lastVoucher: resp.data,
        loading: false,
      });

      toast.success("✅ Comprobante AFIP generado exitosamente", { 
        id: "afip-voucher",
        description: `CAE: ${resp.data.CAE || 'N/A'}`,
        duration: 5000
      });

      // Ejecutar callback de éxito si se proporciona (para redirección)
      if (onSuccess) {
        onSuccess(resp.data);
      }

      return resp.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string; details?: any }>;
      
      // 🔍 Logging detallado del error
      console.group("❌ Error AFIP Store - crear comprobante");
      console.error("Error completo:", error);
      console.error("Axios error response:", axiosError.response);
      console.error("Axios error response data:", axiosError.response?.data);
      console.error("Status:", axiosError.response?.status);
      console.error("Status Text:", axiosError.response?.statusText);
      console.groupEnd();
      
      // 📝 Extraer mensaje de error más específico
      let errorMessage = "Error al crear comprobante AFIP";
      
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data;
        
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if ((responseData as any).error) {
          errorMessage = (responseData as any).error;
        } else {
          errorMessage = JSON.stringify(responseData, null, 2);
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      // Agregar información del status si está disponible
      if (axiosError.response?.status) {
        errorMessage = `[${axiosError.response.status}] ${errorMessage}`;
      }

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al generar comprobante AFIP", {
        id: "afip-voucher",
        description: errorMessage,
        duration: 8000
      });

      // Re-throw el error para que el componente pueda manejarlo si es necesario
      throw error;
    }
  },

  /** Último comprobante autorizado (FECompUltimoAutorizado) */
  fetchUltimoAutorizado: async (ptoVta: number, cbteTipo: number) => {
    set({ loading: true, error: null });
    try {
      // Ej: GET /afip/ultimo?ptoVta=1&cbteTipo=6
      const params = new URLSearchParams({
        ptoVta: String(ptoVta),
        cbteTipo: String(cbteTipo),
      });
      const resp = await api.get<AfipUltimoAutorizado>(`/afip/ultimo?${params.toString()}`);
      
      set({ lastUltimo: resp.data, loading: false });

      toast.success("🔍 Último comprobante consultado", {
        description: `Punto de venta ${ptoVta}, Tipo ${cbteTipo}`,
        duration: 3000
      });

      return resp.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - último autorizado:", error);
      
      const errorMessage = axiosError.response?.data?.message || "Error al consultar último autorizado";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al consultar último autorizado", {
        description: errorMessage,
        duration: 4000
      });
    }
  },

  /** Catálogo: Tipos de comprobante */
  fetchCbteTipos: async () => {
    set({ loading: true, error: null });
    try {
      // Ej: GET /afip/catalogs/cbteTipos
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/cbteTipos");
      
      set({ cbteTipos: resp.data, loading: false, isInitialized: true });

      toast.success("📋 Tipos de comprobante actualizados", {
        description: `${resp.data.length} tipos cargados`,
        duration: 2000
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - cbteTipos:", error);
      
      const errorMessage = axiosError.response?.data?.message || "Error al obtener tipos de comprobante";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al cargar tipos de comprobante", {
        description: errorMessage,
        duration: 4000
      });
    }
  },

  /** Catálogo: Tipos de documento */
  fetchDocTipos: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/docTipos");
      
      set({ docTipos: resp.data, loading: false, isInitialized: true });

      toast.success("🆔 Tipos de documento actualizados", {
        description: `${resp.data.length} tipos cargados`,
        duration: 2000
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - docTipos:", error);
      
      const errorMessage = axiosError.response?.data?.message || "Error al obtener tipos de documento";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al cargar tipos de documento", {
        description: errorMessage,
        duration: 4000
      });
    }
  },

  /** Catálogo: Alícuotas IVA */
  fetchIvaAlicuotas: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/ivaAlicuotas");
      
      set({ ivaAlicuotas: resp.data, loading: false, isInitialized: true });

      toast.success("💰 Alícuotas IVA actualizadas", {
        description: `${resp.data.length} alícuotas cargadas`,
        duration: 2000
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - ivaAlicuotas:", error);
      
      const errorMessage = axiosError.response?.data?.message || "Error al obtener alícuotas de IVA";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al cargar alícuotas de IVA", {
        description: errorMessage,
        duration: 4000
      });
    }
  },

  /** Catálogo: Monedas */
  fetchMonedas: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/monedas");
      
      set({ monedas: resp.data, loading: false, isInitialized: true });

      toast.success("💱 Monedas actualizadas", {
        description: `${resp.data.length} monedas cargadas`,
        duration: 2000
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - monedas:", error);
      
      const errorMessage = axiosError.response?.data?.message || "Error al obtener monedas";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error("❌ Error al cargar monedas", {
        description: errorMessage,
        duration: 4000
      });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),

  reset: () =>
    set({
      loading: false,
      error: null,
      lastVoucher: null,
      lastUltimo: null,
      cbteTipos: [],
      docTipos: [],
      ivaAlicuotas: [],
      monedas: [],
      isInitialized: false,
    }),
}));
