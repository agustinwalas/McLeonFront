// src/pages/auth/Login.tsx
import { LoginForm } from "@/components/auth/Login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/store/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/ventas", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate("/admin/ventas", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#05294f' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-30 w-30 flex items-center justify-center">
            <img
              className="h-full w-auto"
              src="/LogoMcleon.png"
              alt="McLeon"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Accede al panel de administración
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
        
        {/* <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Crear cuenta
            </button>
          </p>
        </div> */}
      </div>
    </div>
  );
}