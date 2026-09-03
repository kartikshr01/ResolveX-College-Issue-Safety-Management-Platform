import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";

<<<<<<< HEAD
/* ================= AUTH PAGES ================= */
=======
/* =========================
   AUTH
========================= */
>>>>>>> origin/Khushi_Sharma

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

<<<<<<< HEAD
/* ================= USER PAGES ================= */

import Profile from "../pages/Profile/Profile";
=======
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
import AllTickets_Admin_Only from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";
>>>>>>> origin/Khushi_Sharma

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
   PLACEHOLDER
========================= */

const PlaceholderPage = ({ title }) => {
  return <div>{title} Placeholder</div>;
};


/* =========================
   APP ROUTES
========================= */

<<<<<<< HEAD
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
=======
const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ==================================================
          AUTHENTICATED USER ROUTES
      ================================================== */}
>>>>>>> origin/Khushi_Sharma

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>
<<<<<<< HEAD
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
=======

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<UserDashboard />}
          />


          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* Activity */}

          <Route
            path="/activity"
            element={<Activity />}
          />


          {/* Safety */}

          <Route
            path="/safety"
            element={<SafetyFeed />}
          />

          <Route
            path="/safety/:id"
            element={<SafetyDetails />}
          />


          {/* Report Issue */}

          <Route
            path="/report-issue"
            element={
              <PlaceholderPage title="Report an Issue" />
            }
          />


          {/* Tickets */}

          <Route
            path="/tickets/create"
            element={<CreateTicket />}
          />

          <Route
            path="/tickets/my-tickets"
            element={<MyTickets />}
          />

          <Route
            path="/tickets/:ticketId"
            element={
              <PlaceholderPage title="Ticket Details" />
            }
          />

          <Route
            path="/tickets/:ticketId/edit"
            element={<EditTicket />}
          />

          <Route
            path="/tickets/all-admin"
            element={<AllTickets_Admin_Only />}
          />

>>>>>>> origin/Khushi_Sharma
        </Route>

      </Route>

<<<<<<< HEAD
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

=======

      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["ADMIN"]}
          />
        }
      >

        <Route element={<AppLayout />}>

          <Route
            path="/admin"
            element={
              <PlaceholderPage title="Admin Dashboard" />
            }
          />

          <Route
            path="/admin/issues"
            element={
              <PlaceholderPage title="All Issues" />
            }
          />

          <Route
            path="/admin/technicians"
            element={
              <PlaceholderPage title="Technician Management" />
            }
          />

>>>>>>> origin/Khushi_Sharma
          <Route
            path="/admin/departments"
            element={
              <PlaceholderPage title="Department Management" />
            }
          />

<<<<<<< HEAD
          {/* ================= ANALYTICS ================= */}

          <Route
            path="/admin/statistics"
            element={<Statistics title="Analytics" />}
          />
=======
          <Route
            path="/admin/analytics"
            element={
              <PlaceholderPage title="Analytics" />
            }
          />

>>>>>>> origin/Khushi_Sharma
        </Route>

      </Route>

<<<<<<< HEAD
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
=======

      {/* ==================================================
          TECHNICIAN ROUTES
      ================================================== */}

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["TECHNICIAN"]}
          />
        }
      >

        <Route element={<AppLayout />}>

          {/* Technician Dashboard */}

          <Route
            path="/technician"
            element={<TechnicianDashboard />}
          />


          {/* Assigned Issues */}

          <Route
            path="/technician/issues"
            element={<TechnicianIssues />}
          />


          {/* Ticket Details */}

          <Route
            path="/technician/ticket/:ticketId"
            element={<TechnicianTicketDetails />}
          />


          {/* Resolution History */}

          <Route
            path="/technician/history"
            element={<TechnicianHistory />}
>>>>>>> origin/Khushi_Sharma
          />

        </Route>

      </Route>

<<<<<<< HEAD
      {/* =====================================================
          ROOT REDIRECT
      ===================================================== */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* =====================================================
          404 FALLBACK
      ===================================================== */}

      <Route path="*" element={<Navigate to="/login" replace />} />
=======

      {/* ==================================================
          DEFAULT
      ================================================== */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

>>>>>>> origin/Khushi_Sharma
    </Routes>
  );
};

export default AppRoutes;