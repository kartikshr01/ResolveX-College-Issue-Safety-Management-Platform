import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AppLayout from "../components/Layout/AppLayout";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// User Pages
import Profile from "../pages/Profile/Profile";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import SafetyCard from "../components/safety/SafetyCard";
import SafetyDetails from "../components/safety/SafetyDetails";
import SafetyFeed from "../components/safety/SafetyFeed";

// Ticket Pages
import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTicket from "../pages/Tickets/MyTicket/MyTicket";
import TicketDetail from "../pages/Tickets/TicketDetails/TicketDetails";
import EditTickets from "../pages/Tickets/EditTickets/EditTickets";

// Admin Pages
import AllTickets from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";

// Placeholder Component
const PlaceholderPage = ({ title }) => {
  return <div>{title} Placeholder</div>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= USER ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Report Issue */}
          <Route path="/report-issue" element={<CreateTicket />} />

          {/* My Issues */}
          <Route path="/my-issues" element={<MyTicket />} />

          {/* Ticket Details */}
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />

          {/* Edit Ticket */}
          <Route path="/tickets/:ticketId/edit" element={<EditTickets />} />

          {/* Activity */}
          <Route path="/activity" element={<Activity />} />

          {/* Profile */}
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

          <Route path="/admin/tickets" element={<AllTickets />} />
        </Route>
      </Route>

      {/* ================= TECHNICIAN ROUTES ================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          <Route
            path="/technician"
            element={<PlaceholderPage title="Technician Dashboard" />}
          />
        </Route>
      </Route>

      {/* ================= DEFAULT ROUTES ================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;