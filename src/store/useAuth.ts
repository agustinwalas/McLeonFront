import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/types";

interface DecodedToken {
  exp: number;
  id: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: IUser | null;
  loading: boolean;
  error: string | null;

  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => Promise<void>;

  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;

  logout: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      loading: false,
      error: null,

      register: async (data: {
        email: string;
        password: string;
        name: string;
        phone: string;
      }) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/register", data);

          const user: IUser = res.data.user || {
            _id: res.data.id || "",
            email: data.email,
            phone: data.phone,
            name: res.data.name ?? "Usuario",
            isAdmin: res.data.isAdmin ?? false,
          };

          set({
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin || false,
            loading: false,
          });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          set({
            error: error.response?.data?.message || "Error al registrarse",
            loading: false,
          });
        }
      },

      login: async ({ email, password }: {
        email: string;
        password: string;
      }) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/login", { email, password });

          const user: IUser = res.data.user || {
            _id: res.data.id || "",
            email: res.data.email,
            name: res.data.name,
            phone: res.data.phone || "",
            isAdmin: res.data.isAdmin ?? false,
          };

          localStorage.setItem("token", res.data.token);

          set({
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin || false,
            loading: false,
          });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          set({
            error: error.response?.data?.message || "Error al iniciar sesión",
            loading: false,
          });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      storage: {
        getItem: (key) => {
          const item = localStorage.getItem(key);
          if (!item) return null;

          const parsed = JSON.parse(item);
          const token = localStorage.getItem("token");

          // Validar el token
          if (token) {
            try {
              const decoded = jwtDecode<DecodedToken>(token);
              if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                localStorage.removeItem(key);
                return null;
              }
            } catch {
              localStorage.removeItem("token");
              localStorage.removeItem(key);
              return null;
            }
          }

          return parsed.state;
        },
        setItem: (key, value) => {
          const wrapped = { state: value, timestamp: Date.now() };
          localStorage.setItem(key, JSON.stringify(wrapped));
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

export default useAuth;
