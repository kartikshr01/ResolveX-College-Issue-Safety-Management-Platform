import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "./pages/admin/AdminDashboard";
import TechnicianManagement from "./pages/admin/TechnicianManagement";
import Statistics from "./pages/admin/Statistics";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/admin/technicians"
          element={<TechnicianManagement />}
        />

        <Route path="/admin/statistics" element={<Statistics />} />

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;