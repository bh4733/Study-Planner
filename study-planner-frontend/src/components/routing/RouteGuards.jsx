import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

// Pages that need a login. Remembers where the user was heading so login can send them back.
export function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// Login and register pages: a logged-in user is sent on to the app instead
export function PublicOnlyRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (isLoggedIn) return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  return (
    <main className="auth-page">
      <Outlet />
    </main>
  );
}
