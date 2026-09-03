import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

// Public pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Common pages
import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import TechnicianManagement from "../pages/admin/TechnicianManagement";
import Statistics from "../pages/admin/Statistics";
import AdminActivity from "../pages/admin/ActivityAdmin";
import AdminTicketDetails from "../pages/admin/AdminTicketDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =========================
          PROTECTED ROUTES
      ========================== */}

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* =========================
          ADMIN ROUTES
      ========================== */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Technician Management */}
        <Route path="/admin/technicians" element={<TechnicianManagement />} />

        {/* Statistics */}
        <Route path="/admin/statistics" element={<Statistics />} />

        {/* All Admin Activities */}
        <Route path="/admin/activity" element={<AdminActivity />} />

        {/* Activity → Ticket Details */}
        <Route
          path="/admin/activity/ticket/:ticketId"
          element={<AdminTicketDetails />}
        />
      </Route>

      {/* =========================
          TECHNICIAN ROUTES
      ========================== */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route
          path="/technician"
          element={
            <div>
              <h1>Technician Dashboard</h1>
            </div>
          }
        />
      </Route>

      {/* =========================
          UNAUTHORIZED
      ========================== */}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =========================
          DEFAULT ROUTE
      ========================== */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* =========================
          UNKNOWN ROUTES
      ========================== */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
