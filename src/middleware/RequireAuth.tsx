import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import useAuth from "@/store/useAuth";

type Props = {
  children: ReactNode;
  adminOnly?: boolean;
};

export default function RequireAuth({ children, adminOnly = false }: Props) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
