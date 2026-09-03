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
import AllTickets_Admin_Only from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";

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

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

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

        </Route>

      </Route>


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

          <Route
            path="/admin/departments"
            element={
              <PlaceholderPage title="Department Management" />
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <PlaceholderPage title="Analytics" />
            }
          />

        </Route>

      </Route>


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
          />

        </Route>

      </Route>


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

    </Routes>
  );
};

export default AppRoutes;