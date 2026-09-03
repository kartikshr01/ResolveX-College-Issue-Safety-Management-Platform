import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/Layout/AppLayout";

import TechnicianDashboard from "./pages/TechnicianDashboard/TechnicianDashboard";
import TicketDetails from "./pages/TicketDetails/TicketDetails";

import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            APP LAYOUT
        ========================= */}

        <Route element={<AppLayout />}>

          {/* Technician */}
          <Route
            path="/technician"
            element={<TechnicianDashboard />}
          />

          {/* Technician Ticket Details */}
          <Route
            path="/technician/ticket/:ticketId"
            element={<TicketDetails />}
          />

          {/* Safety */}
          <Route
            path="/"
            element={<SafetyFeed />}
          />

          <Route
            path="/safety"
            element={<SafetyFeed />}
          />

          <Route
            path="/safety/:id"
            element={<SafetyDetails />}
          />

          {/* Activity */}
          <Route
            path="/activity"
            element={<Activity />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;