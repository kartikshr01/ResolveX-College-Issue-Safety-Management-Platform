import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import AppLayout from "../components/Layout/AppLayout";
import AdminLayout from "../components/Layout/AdminLayout/AdminLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

import Profile from "../pages/Profile/Profile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import TechnicianManagement from "../pages/admin/TechnicianManagement";
import Statistics from "../pages/admin/Statistics";
import AdminActivity from "../pages/admin/ActivityAdmin";
import AdminTicketDetails from "../pages/admin/AdminTicketDetails";

import TechnicianDashboard from "../pages/Technician/TechnicianDashboard/TechnicianDashboard";
import TechnicianIssues from "../pages/Technician/TechnicianIssues/TechnicianIssues";
import TechnicianHistory from "../pages/Technician/TechnicianHistory/TechnicianHistory";

import CreateTicket from "../pages/Tickets/CreateTicket/CreateTicket";
import MyTickets from "../pages/Tickets/MyTicket/MyTicket";
import TicketDetails from "../pages/Tickets/TicketDetails/TicketDetails";
import TechnicianTicketCard from "../components/TechnicianTicketCard/TechnicianTicketCard";
import EditTicket from "../pages/Tickets/EditTickets/EditTickets";
import AllTickets_Admin_Only from "../pages/Tickets/AllTickets-Admin_Only/AllTickets-Admin_Only";

import SafetyFeed from "../components/safety/SafetyFeed";
import SafetyDetails from "../components/safety/SafetyDetails";

import Activity from "../components/activity/Activity";

import UserDashboard from "../pages/Dashboard/UserDashboard";

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>This page is currently under development.</p>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/issues" element={<MyTickets />} />
          <Route path="/tickets/my-tickets" element={<MyTickets />} />

          <Route path="/report-issue" element={<CreateTicket />} />
          <Route path="/tickets/create" element={<CreateTicket />} />

          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
          <Route
            path="/tickets/:ticketId/edit"
            element={<EditTicket />}
          />

          <Route path="/safety" element={<SafetyFeed />} />
          <Route path="/safety/:id" element={<SafetyDetails />} />

          <Route path="/activity" element={<Activity />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/admin/issues"
            element={<AllTickets_Admin_Only />}
          />

          <Route path="/admin/activity" element={<AdminActivity />} />

          <Route
            path="/admin/activity/ticket/:ticketId"
            element={<AdminTicketDetails />}
          />

          <Route
            path="/admin/technicians"
            element={<TechnicianManagement />}
          />

          <Route
            path="/admin/departments"
            element={<PlaceholderPage title="Department Management" />}
          />

          <Route path="/admin/statistics" element={<Statistics />} />

          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={["TECHNICIAN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/technician" element={<TechnicianDashboard />} />

          <Route
            path="/technician/issues"
            element={<TechnicianIssues />}
          />

          <Route
            path="/technician/ticket/:ticketId"
            element={<TechnicianTicketCard />}
          />

          <Route
            path="/technician/history"
            element={<TechnicianHistory />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;