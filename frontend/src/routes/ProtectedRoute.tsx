import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children?: ReactNode;
}

/**
 * Protects routes that require the user to be authenticated.
 * - If the user is not authenticated: redirect to /login
 * - If the user is authenticated: render the children or nested route (Outlet)
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth(); // adjust if needed

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default ProtectedRoute;
