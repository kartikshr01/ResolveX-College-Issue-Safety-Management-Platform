import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";
import AdminLayout from "../components/Layout/AdminLayout/AdminLayout";

/* ================= AUTH PAGES ================= */

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

/* ================= COMMON ================= */

import Profile from "../pages/Profile/Profile";

/* ================= ADMIN ================= */

import AdminDashboard from "../pages/admin/AdminDashboard";
import TechnicianManagement from "../pages/admin/TechnicianManagement";
import Statistics from "../pages/admin/Statistics";
import AdminActivity from "../pages/admin/ActivityAdmin";
import AdminTicketDetails from "../pages/admin/AdminTicketDetails";

/* ================= TECHNICIAN ================= */

import TechnicianDashboard from "../pages/Technician/TechnicianDashboard/TechnicianDashboard";
import TechnicianIssues from "../pages/Technician/TechnicianIssues/TechnicianIssues";
import TechnicianHistory from "../pages/Technician/TechnicianHistory/TechnicianHistory";

/* ================= TICKETS ================= */

import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTickets from "../pages/Tickets/MyTicket/MyTicket";
import TicketDetails from "../pages/Tickets/TicketDetails/TicketDetails";
import EditTicket from "../pages/Tickets/EditTickets/EditTickets";
import AllTickets_Admin_Only from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";

/* ================= SAFETY & ACTIVITY ================= */

import SafetyFeed from "../components/safety/SafetyFeed";
import SafetyDetails from "../components/safety/SafetyDetails";
import Activity from "../components/activity/Activity";

/* ================= USER ================= */

import UserDashboard from "../pages/Dashboard/UserDashboard";

/* =====================================================
   PLACEHOLDER
===================================================== */

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>This page is currently under development.</p>
    </div>
  );
};

/* =====================================================
   APP ROUTES
===================================================== */

const AppRoutes = () => {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =================================================
          AUTHENTICATED USER ROUTES
      ================================================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* USER DASHBOARD */}

          <Route path="/dashboard" element={<UserDashboard />} />

          {/* PROFILE */}

          <Route path="/profile" element={<Profile />} />

          {/* MY TICKETS */}

          <Route path="/issues" element={<MyTickets />} />

          <Route path="/tickets/my-tickets" element={<MyTickets />} />

          {/* CREATE TICKET */}

          <Route path="/report-issue" element={<CreateTicket />} />

          <Route path="/tickets/create" element={<CreateTicket />} />

          {/* TICKET DETAILS */}

          <Route path="/tickets/:ticketId" element={<TicketDetails />} />

          {/* EDIT TICKET */}

          <Route path="/tickets/:ticketId/edit" element={<EditTicket />} />

          {/* SAFETY */}

          <Route path="/safety" element={<SafetyFeed />} />

          <Route path="/safety/:id" element={<SafetyDetails />} />

          {/* USER ACTIVITY */}

          <Route path="/activity" element={<Activity />} />
        </Route>
      </Route>

      {/* =================================================
          ADMIN ROUTES
          
          IMPORTANT:
          Admin uses AdminLayout.
          It does NOT use AppLayout.
      ================================================= */}

      {/* =====================================================
    ADMIN ONLY ROUTES
===================================================== */}

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          {/* ADMIN DASHBOARD */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ALL ISSUES / TICKETS */}
          <Route path="/admin/issues" element={<AllTickets_Admin_Only />} />

          {/* ACTIVITY */}
          <Route path="/admin/activity" element={<AdminActivity />} />

          {/* ACTIVITY TICKET DETAILS */}
          <Route
            path="/admin/activity/ticket/:ticketId"
            element={<AdminTicketDetails />}
          />

          {/* TECHNICIANS */}
          <Route path="/admin/technicians" element={<TechnicianManagement />} />

          {/* DEPARTMENTS */}
          <Route
            path="/admin/departments"
            element={<PlaceholderPage title="Department Management" />}
          />

          {/* STATISTICS */}
          <Route path="/admin/statistics" element={<Statistics />} />

          {/* PROFILE */}
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Route>
      {/* =================================================
          TECHNICIAN ROUTES
      ================================================= */}

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          {/* DASHBOARD */}

          <Route path="/technician" element={<TechnicianDashboard />} />

          {/* ASSIGNED ISSUES */}

          <Route path="/technician/issues" element={<TechnicianIssues />} />

          {/* HISTORY */}

          <Route path="/technician/history" element={<TechnicianHistory />} />
        </Route>
      </Route>

      {/* =================================================
          ROOT
      ================================================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* =================================================
          404
      ================================================= */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
