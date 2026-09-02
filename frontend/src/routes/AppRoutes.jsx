import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import CreateTicket from "../pages/Tickets/CreateTicket"
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Role-Based Routes */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route
          path="/admin"
          element={
            <div>
              <h1>Admin Dashboard</h1>
            </div>
          }
        />
      </Route>

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

      {/* Unauthorized */}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default Route */}

      {/* <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
 */}

      {/* Unknown Routes */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;