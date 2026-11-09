import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = () =>
  useAuth().isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;

export const PublicOnlyRoute = () =>
  useAuth().isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
