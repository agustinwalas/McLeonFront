// src/pages/auth/Register.tsx
import { RegisterForm } from "@/components/auth/Register";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/store/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/ventas", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-20 w-20 flex items-center justify-center">
            <img
              className="h-full w-auto"
              src="/LogoEjemplo.png"
              alt="Stampi"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para acceder al panel de administración
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <RegisterForm />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}