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
  
  getCurrentUser: () => IUser | null;
  validateSession: () => boolean;
  initializeAuth: () => void; // ✅ Nueva función
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      loading: false,
      error: null,

      // ✅ Nueva función para inicializar auth al cargar la app
      initializeAuth: () => {
        console.log("🚀 Inicializando autenticación...");
        
        const token = localStorage.getItem("token");
        console.log("🔍 Token encontrado:", !!token);
        
        if (!token) {
          console.log("❌ No hay token, manteniendo deslogueado");
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          });
          return;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const now = Date.now();
          const tokenExp = decoded.exp * 1000;
          
          console.log("🔍 Token válido:", {
            exp: new Date(tokenExp),
            now: new Date(now),
            isExpired: tokenExp <= now,
            minutesLeft: Math.round((tokenExp - now) / 1000 / 60)
          });

          if (tokenExp <= now) {
            console.warn("⚠️ Token expirado al inicializar");
            localStorage.removeItem("token");
            set({
              isAuthenticated: false,
              user: null,
              isAdmin: false,
            });
            return;
          }

          // ✅ Reconstruir usuario desde token
          const user: IUser = {
            _id: decoded.id,
            email: decoded.email,
            name: decoded.email,
            phone: "",
            isAdmin: decoded.isAdmin
          };

          console.log("✅ Usuario reconstruido desde token:", user);

          set({
            user,
            isAuthenticated: true,
            isAdmin: decoded.isAdmin,
          });

        } catch (error) {
          console.error("❌ Error al decodificar token:", error);
          localStorage.removeItem("token");
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          });
        }
      },

      register: async (data: {
        email: string;
        password: string;
        name: string;
        phone: string;
      }) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/register", data);

          const user: IUser = {
            _id: res.data.user?._id || res.data.id || res.data.user?.id || "",
            email: res.data.user?.email || data.email,
            phone: res.data.user?.phone || data.phone,
            name: res.data.user?.name || res.data.name || "Usuario",
            isAdmin: res.data.user?.isAdmin || res.data.isAdmin || false,
          };

          console.log("✅ Usuario registrado:", user);

          // ✅ Guardar token en register también
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
          }

          set({
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin,
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

          console.log("🔍 Respuesta del login:", res.data);

          const userData = res.data.user || res.data;
          const user: IUser = {
            _id: userData._id || userData.id || "",
            email: userData.email || email,
            name: userData.name || userData.email || "Usuario",
            phone: userData.phone || "",
            isAdmin: userData.isAdmin || false,
          };

          console.log("✅ Usuario normalizado:", user);

          // ✅ Verificar que hay token
          if (!res.data.token) {
            throw new Error("No se recibió token de autenticación");
          }

          localStorage.setItem("token", res.data.token);
          console.log("✅ Token guardado");

          set({
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin,
            loading: false,
          });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          console.error("❌ Error en login:", error);
          set({
            error: error.response?.data?.message || error.message || "Error al iniciar sesión",
            loading: false,
          });
        }
      },

      logout: () => {
        console.log("🚪 Logout ejecutado");
        localStorage.removeItem("token");
        set({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
          error: null,
        });
      },

      getCurrentUser: () => {
        const state = get();
        console.log("🔍 getCurrentUser llamado:", {
          isAuthenticated: state.isAuthenticated,
          hasUser: !!state.user,
          userId: state.user?._id
        });
        
        if (!state.isAuthenticated || !state.user) {
          console.log("❌ No autenticado o sin usuario");
          return null;
        }

        return state.user;
      },

      validateSession: () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.warn("⚠️ No hay token");
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          });
          return false;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const now = Date.now();
          const tokenExp = decoded.exp * 1000;
          
          if (tokenExp <= now) {
            console.warn("⚠️ Token expirado");
            get().logout();
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("❌ Token inválido:", error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      // ✅ Solo persistir datos esenciales
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        user: state.user,
      }),
      // ✅ Storage personalizado MÁS SIMPLE
      storage: {
        getItem: (key) => {
          console.log("📖 Cargando storage:", key);
          try {
            const item = localStorage.getItem(key);
            if (!item) {
              console.log("📖 No hay datos en storage");
              return null;
            }

            const parsed = JSON.parse(item);
            console.log("📖 Datos cargados:", parsed);

            // ✅ NO validar token aquí, solo cargar datos
            return parsed;
          } catch (error) {
            console.error("❌ Error cargando storage:", error);
            localStorage.removeItem(key);
            return null;
          }
        },
        
        setItem: (key, value) => {
          console.log("💾 Guardando storage:", key, value);
          try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log("✅ Storage guardado");
          } catch (error) {
            console.error("❌ Error guardando storage:", error);
          }
        },
        
        removeItem: (key) => {
          console.log("🗑️ Removiendo storage:", key);
          localStorage.removeItem(key);
        },
      },
    }
  )
);

export default useAuth;
