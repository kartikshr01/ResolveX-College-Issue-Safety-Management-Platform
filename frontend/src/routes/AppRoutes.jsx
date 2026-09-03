import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      {/* Admin Routes */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["ADMIN"]}
          />
        }
      >
        <Route
          path="/admin"
          element={
            <div>
              <h1>Admin Dashboard</h1>
            </div>
          }
        />
      </Route>

      {/* Technician Routes */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["TECHNICIAN"]}
          />
        }
      >
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

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />
    </Routes>
  );
};

export default AppRoutes;