import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AppLayout from "../components/Layout/AppLayout";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// User & Profile Pages
import Profile from "../pages/Profile/Profile";

// Ticket Pages
import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTickets from "../pages/Tickets/MyTicket/MyTicket";
import TicketDetails from "../pages/Tickets/TicketDetails/TicketDetails";
import EditTicket from "../pages/Tickets/EditTickets/EditTickets";

import UserDashboard from "../pages/Dashboard/UserDashboard";

import Activity from "../components/activity/Activity";
import SafetyFeed from "../components/safety/SafetyFeed";

// Placeholder Component (If not imported from elsewhere)
const PlaceholderPage = ({ title }) => <div>{title} Placeholder</div>;
const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= ALL AUTHENTICATED USERS ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* General Navigation */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />

          {/* Ticket/Issue Reporting */}
          <Route
            path="/report-issue"
            element={<PlaceholderPage title="Report an Issue" />}
          />
          <Route path="/safety" element={<SafetyFeed />} />

          {/* Main Ticket Feature Routes */}
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/my-tickets" element={<MyTickets />} />
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
          <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />
        </Route>
      </Route>

      {/* ================= ADMIN ONLY ROUTES ================= */}
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

      {/* ================= TECHNICIAN ONLY ROUTES ================= */}
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

      {/* ================= FALLBACK FALLTHROUGHS ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
