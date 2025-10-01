import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import BranchDashboard from "./Pages/BranchDashboard.jsx";
import CustomerExperience from "./Pages/CustomerExperience.jsx";
import BranchHub from "./Pages/BranchHub.jsx";
import BranchMenu from "./Pages/BranchMenu.jsx"; // ← NUEVO

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* Alias: /hub -> /dashboard (evita loop si llegan a /hub sin :code) */}
        <Route path="/hub" element={<Navigate to="/dashboard" replace />} />

        {/* Hub sucursal con código */}
        <Route path="/hub/:code" element={<BranchHub />} />

        {/* Menú intermedio de sucursal (NUEVO) */}
        <Route path="/sucursal/:code/menu" element={<BranchMenu />} />

        {/* Vistas de sucursal existentes */}
        <Route path="/sucursal/:code" element={<BranchDashboard />} />
        <Route path="/sucursal/:code/experience" element={<CustomerExperience />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
