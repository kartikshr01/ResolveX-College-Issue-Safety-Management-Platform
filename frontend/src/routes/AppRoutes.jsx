import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";

/* ================= AUTH PAGES ================= */

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

/* ================= USER PAGES ================= */

import Profile from "../pages/Profile/Profile";

import UserDashboard from "../pages/Dashboard/UserDashboard";

/* ================= TICKET PAGES ================= */

import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";

import MyTickets from "../pages/Tickets/MyTicket/MyTicket";

import TicketDetails from "../pages/Tickets/TicketDetails/TicketDetails";

import EditTicket from "../pages/Tickets/EditTickets/EditTickets";

import AllTickets_Admin_Only from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";

/* ================= SAFETY & ACTIVITY ================= */

import SafetyFeed from "../components/safety/SafetyFeed";

import SafetyDetails from "../components/safety/SafetyDetails";

import Activity from "../components/activity/Activity";

/* ================= PLACEHOLDER ================= */

const PlaceholderPage = ({ title }) => (
  <div>
    <h1>{title}</h1>
    <p>This page is currently under development.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =====================================================
          ALL AUTHENTICATED USERS
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* ================= USER DASHBOARD ================= */}

          <Route path="/dashboard" element={<UserDashboard />} />

          {/* ================= PROFILE ================= */}

          <Route path="/profile" element={<Profile />} />

          {/* ================= MY TICKETS ================= */}

          <Route path="/issues" element={<MyTickets />} />

          {/* Alternative route for compatibility */}

          <Route path="/tickets/my-tickets" element={<MyTickets />} />

          {/* ================= CREATE TICKET ================= */}

          <Route path="/report-issue" element={<CreateTicket />} />

          {/* Alternative route */}

          <Route path="/tickets/create" element={<CreateTicket />} />

          {/* ================= TICKET DETAILS ================= */}

          <Route path="/tickets/:ticketId" element={<TicketDetails />} />

          {/* ================= EDIT TICKET ================= */}

          <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />

          {/* ================= SAFETY ================= */}

          <Route path="/safety" element={<SafetyFeed />} />

          <Route path="/safety/:id" element={<SafetyDetails />} />

          {/* ================= ACTIVITY ================= */}

          <Route path="/activity" element={<Activity />} />
        </Route>
      </Route>

      {/* =====================================================
          ADMIN ONLY ROUTES
      ===================================================== */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          {/* ================= ADMIN DASHBOARD ================= */}

          <Route
            path="/admin"
            element={<AdminDashboard title="Admin Dashboard" />}
          />

          {/* ================= ALL ISSUES ================= */}

          <Route path="/admin/issues" element={<AllTickets_Admin_Only />} />

          {/* ================= ACTIVITY================= */}

          <Route path="/admin/activity" element={<AdminActivity />} />

          {/* ================= TECHNICIANS ================= */}

          <Route
            path="/admin/technicians"
            element={<TechnicianManagement title="Technician Management" />}
          />

          {/* ================= DEPARTMENTS ================= */}

          <Route
            path="/admin/departments"
            element={<PlaceholderPage title="Department Management" />}
          />

          {/* ================= ANALYTICS ================= */}

          <Route
            path="/admin/statistics"
            element={<Statistics title="Analytics" />}
          />
        </Route>
      </Route>

      {/* =====================================================
          TECHNICIAN ONLY ROUTES
      ===================================================== */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          {/* ================= TECHNICIAN DASHBOARD ================= */}

          <Route
            path="/technician"
            element={<TechnicianDashboard title="Technician Dashboard" />}
          />

          {/* ================= ASSIGNED ISSUES ================= */}

          <Route
            path="/technician/issues"
            element={<TechnicianIssues title="Assigned Issues" />}
          />

          {/* ================= RESOLUTION HISTORY ================= */}

          <Route
            path="/technician/history"
            element={<TechnicianHistory title="Resolution History" />}
          />
        </Route>
      </Route>

      {/* =====================================================
          ROOT REDIRECT
      ===================================================== */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* =====================================================
          404 FALLBACK
      ===================================================== */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
