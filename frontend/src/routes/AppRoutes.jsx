import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTickets from "../pages/Tickets/MyTicket/MyTicket";
import TicketDetails from "../pages/Tickets/TicketDetails/TicketDetails";
import EditTicket from "../pages/Tickets/EditTickets/EditTickets";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* All Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/profile" element={<Profile />} />

          {/* Ticket Routes */}
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/my-tickets" element={<MyTickets />} />
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
          <Route path="/tickets/all-admin" element={<allTickets />} />
          <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />

          {/* Temporary routes */}
          <Route path="/issues" element={<div>Issues Page</div>} />

          <Route path="/safety" element={<div>Safety Page</div>} />

          <Route path="/activity" element={<div>Activity Page</div>} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Route>

      {/* Technician Routes */}
      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/technician" element={<h1>Technician Dashboard</h1>} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
