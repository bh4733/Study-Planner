import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand">
          Study Planner
        </Link>
        <nav aria-label="Main">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {/* Calendar, New task etc. go here later */}
        </nav>
        <div className="user-menu">
          <span className="muted">
            Signed in as <strong>{user?.username}</strong>
          </span>
          {/* Arrow function, so the click event isn't passed to logout as the "message" argument */}
          <button
            type="button"
            className="button button-secondary"
            onClick={() => logout()}
          >
            Log out
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
