import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "./components/routing/RouteGuards";
import AppLayout from "./components/layout/applayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// ✅ Main App Component
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* /tasks/new, /tasks/:id/edit, /calendar go here next */}
          </Route>
        </Route>

        {/* "/" and unknown URLs go to the dashboard, which redirects to login if needed */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
