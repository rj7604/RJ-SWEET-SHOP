import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Admin from "./Admin";

/* ===== Helpers ===== */
const isLoggedIn = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("role") === "admin";

/* ===== Protected Routes ===== */
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  return isLoggedIn() && isAdmin() ? children : <Navigate to="/dashboard" replace />;
}

/* ===== App ===== */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Auth />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
