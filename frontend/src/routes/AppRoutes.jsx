import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>This page is under development.</p>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================= ALL AUTHENTICATED USERS ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* USER / STUDENT / FACULTY */}

          <Route
            path="/dashboard"
            element={<PlaceholderPage title="Dashboard" />}
          />

          <Route
            path="/issues"
            element={<PlaceholderPage title="My Reports" />}
          />

          <Route
            path="/report-issue"
            element={<PlaceholderPage title="Report an Issue" />}
          />

          <Route
            path="/safety"
            element={<PlaceholderPage title="Safety Reports" />}
          />

          <Route
            path="/activity"
            element={<PlaceholderPage title="Activity" />}
          />

          {/* COMMON */}

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route
            path="/admin"
            element={<PlaceholderPage title="Admin Dashboard" />}
          />

          <Route
            path="/admin/issues"
            element={<PlaceholderPage title="All Issues" />}
          />

          <Route
            path="/admin/technicians"
            element={<PlaceholderPage title="Technician Management" />}
          />

          <Route
            path="/admin/departments"
            element={<PlaceholderPage title="Department Management" />}
          />

          <Route
            path="/admin/analytics"
            element={<PlaceholderPage title="Analytics" />}
          />
        </Route>
      </Route>

      {/* ================= TECHNICIAN ROUTES ================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          <Route
            path="/technician"
            element={<PlaceholderPage title="Technician Dashboard" />}
          />

          <Route
            path="/technician/issues"
            element={<PlaceholderPage title="Assigned Issues" />}
          />

          <Route
            path="/technician/history"
            element={<PlaceholderPage title="Resolution History" />}
          />
        </Route>
      </Route>

      {/* ================= UNAUTHORIZED ================= */}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= DEFAULT ================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
