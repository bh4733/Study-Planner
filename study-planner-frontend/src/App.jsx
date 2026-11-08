import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useContext } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

// ✅ Main App Component
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ✅ Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Catch-all (optional, good practice) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
