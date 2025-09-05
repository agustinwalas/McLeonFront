// src/store/useAfip.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { AxiosError } from "axios";
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
  createVoucher: (data: AfipVoucherCreateInput) => Promise<AfipVoucherResponse | void>;
  fetchUltimoAutorizado: (ptoVta: number, cbteTipo: number) => Promise<AfipUltimoAutorizado | void>;
  fetchCbteTipos: () => Promise<void>;
  fetchDocTipos: () => Promise<void>;
  fetchIvaAlicuotas: () => Promise<void>;
  fetchMonedas: () => Promise<void>;

  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAfipStore = create<AfipStoreState>((set, get) => ({
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
  createVoucher: async (data: AfipVoucherCreateInput) => {
    set({ loading: true, error: null });
    try {
      // Ajustá el endpoint a tu backend
      const resp = await api.post<AfipVoucherResponse>("/afip/vouchers", data);
      set({
        lastVoucher: resp.data,
        loading: false,
      });
      return resp.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      console.error("Error AFIP - crear comprobante:", error);
      set({
        error:
          axiosError.response?.data?.message ||
          (axiosError.response?.data as any)?.error ||
          "Error al crear comprobante AFIP",
        loading: false,
      });
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
      return resp.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - último autorizado:", error);
      set({
        error: axiosError.response?.data?.message || "Error al consultar último autorizado",
        loading: false,
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
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - cbteTipos:", error);
      set({
        error: axiosError.response?.data?.message || "Error al obtener tipos de comprobante",
        loading: false,
      });
    }
  },

  /** Catálogo: Tipos de documento */
  fetchDocTipos: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/docTipos");
      set({ docTipos: resp.data, loading: false, isInitialized: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - docTipos:", error);
      set({
        error: axiosError.response?.data?.message || "Error al obtener tipos de documento",
        loading: false,
      });
    }
  },

  /** Catálogo: Alícuotas IVA */
  fetchIvaAlicuotas: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/ivaAlicuotas");
      set({ ivaAlicuotas: resp.data, loading: false, isInitialized: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - ivaAlicuotas:", error);
      set({
        error: axiosError.response?.data?.message || "Error al obtener alícuotas de IVA",
        loading: false,
      });
    }
  },

  /** Catálogo: Monedas */
  fetchMonedas: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get<AfipCatalogItem[]>("/afip/catalogs/monedas");
      set({ monedas: resp.data, loading: false, isInitialized: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Error AFIP - monedas:", error);
      set({
        error: axiosError.response?.data?.message || "Error al obtener monedas",
        loading: false,
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
