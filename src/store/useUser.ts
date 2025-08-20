import { create } from "zustand";
import api from "@/lib/axios";
import { IUser } from "@/types";

interface UserStoreState {
  users: IUser[];
  loading: boolean;
  error: string | null;

  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/user"); 
      set({ users: res.data, loading: false });
    } catch (error) {
      console.error("Error al traer usuarios:", error);
      set({ error: "Error al traer usuarios", loading: false });
    }
  },
}));
