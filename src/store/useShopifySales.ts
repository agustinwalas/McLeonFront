import { create } from 'zustand';
import api from '@/lib/axios';

export interface ShopifySale {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_price: string;
  currency: string;
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
    sku: string;
  }>;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  [key: string]: any;
}

interface ShopifySalesState {
  sales: ShopifySale[];
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
}

export const useShopifySalesStore = create<ShopifySalesState>((set) => ({
  sales: [],
  loading: false,
  error: null,
  fetchSales: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/shopify-sales');
      set({ sales: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener ventas', loading: false });
    }
  },
}));
