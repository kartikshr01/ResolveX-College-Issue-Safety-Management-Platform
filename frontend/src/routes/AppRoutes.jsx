import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";

/* =========================
   AUTH
========================= */

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

/* =========================
   USER / PROFILE
========================= */

import Profile from "../pages/Profile/Profile";
import UserDashboard from "../pages/Dashboard/UserDashboard";

/* =========================
   TICKETS
========================= */

import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTickets from "../pages/Tickets/MyTicket/MyTicket";
import EditTicket from "../pages/Tickets/EditTickets/EditTickets";
import TicketDetail from "../pages/Tickets/TicketDetails/TicketDetails";

/* =========================
   TECHNICIAN
========================= */

import TechnicianDashboard from "../pages/TechnicianDashboard/TechnicianDashboard";
import TechnicianIssues from "../pages/TechnicianIssues/TechnicianIssues";
import TechnicianHistory from "../pages/TechnicianHistory/TechnicianHistory";
import TechnicianTicketDetails from "../pages/TicketDetails/TicketDetails";

/* =========================
   SAFETY
========================= */

import SafetyFeed from "../components/safety/SafetyFeed";
import SafetyDetails from "../components/safety/SafetyDetails";

/* =========================
   ACTIVITY
========================= */

import Activity from "../components/activity/Activity";

/* =========================
   ADMIN LAYOUT
========================= */

import AdminLayout from "../components/Layout/AdminLayout/AdminLayout";

/* =========================
   ADMIN PAGES
========================= */

import AdminDashboard from "../pages/admin/AdminDashboard";
import TechnicianManagement from "../pages/admin/TechnicianManagement";
import Statistics from "../pages/admin/Statistics";
import AdminActivity from "../pages/admin/ActivityAdmin";
import AdminTicketDetails from "../pages/admin/AdminTicketDetails";

/* =========================
   PLACEHOLDER
========================= */

const PlaceholderPage = ({ title }) => {
  return <div>{title} Placeholder</div>;
};

/* =========================
   APP ROUTES
========================= */

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =========================
          AUTHENTICATED USER ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* USER DASHBOARD */}

          <Route path="/dashboard" element={<UserDashboard />} />

          {/* PROFILE */}

          <Route path="/profile" element={<Profile />} />

          {/* ACTIVITY */}

          <Route path="/activity" element={<Activity />} />

          {/* SAFETY */}

          <Route path="/safety" element={<SafetyFeed />} />

          <Route path="/safety/:id" element={<SafetyDetails />} />

          {/* REPORT ISSUE */}

          <Route path="/report-issue" element={<CreateTicket />} />

          <Route path="/issues" element={<MyTickets />} />

          {/* TICKETS */}

          <Route path="/tickets/create" element={<CreateTicket />} />

          <Route path="/tickets/my-tickets" element={<MyTickets />} />

          <Route
            path="/tickets/:ticketId"
            element={<TicketDetail />}
          />

          <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />
        </Route>
      </Route>

      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          {/* ADMIN DASHBOARD */}

          <Route path="/admin" element={<AdminDashboard />} />

          {/* TECHNICIAN MANAGEMENT */}

          <Route path="/admin/technicians" element={<TechnicianManagement />} />

          {/* STATISTICS */}

          <Route path="/admin/statistics" element={<Statistics />} />

          {/* ADMIN ACTIVITY */}

          <Route path="/admin/activity" element={<AdminActivity />} />

          {/* ADMIN TICKET DETAILS */}

          <Route
            path="/admin/activity/ticket/:ticketId"
            element={<AdminTicketDetails />}
          />

          {/* ADMIN PROFILE */}

          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* =========================
          TECHNICIAN ROUTES
      ========================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          {/* TECHNICIAN DASHBOARD */}

          <Route path="/technician" element={<TechnicianDashboard />} />

          {/* ASSIGNED ISSUES */}

          <Route path="/technician/issues" element={<TechnicianIssues />} />

          {/* TICKET DETAILS */}

          <Route
            path="/technician/ticket/:ticketId"
            element={<TechnicianTicketDetails />}
          />

          {/* RESOLUTION HISTORY */}

          <Route path="/technician/history" element={<TechnicianHistory />} />
        </Route>
      </Route>

      {/* =========================
          DEFAULT ROUTE
      ========================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* =========================
          UNKNOWN ROUTES
      ========================= */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
