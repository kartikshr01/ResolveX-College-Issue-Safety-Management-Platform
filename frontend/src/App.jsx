import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/Layout/AppLayout";

import TechnicianDashboard from "./pages/TechnicianDashboard/TechnicianDashboard";
import TechnicianIssues from "./pages/TechnicianIssues/TechnicianIssues";
import TicketDetails from "./pages/TicketDetails/TicketDetails";
import TechnicianHistory from "./pages/TechnicianHistory/TechnicianHistory";

import "./App.css";

import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            TECHNICIAN LAYOUT
        ========================= */}

        <Route element={<AppLayout />}>

          <Route
            path="/technician"
            element={<TechnicianDashboard />}
          />

          <Route
            path="/technician/issues"
            element={<TechnicianIssues />}
          />

          <Route
            path="/technician/ticket/:ticketId"
            element={<TicketDetails />}
          />

          <Route
            path="/technician/history"
            element={<TechnicianHistory />}
          />

        </Route>


        {/* =========================
            SAFETY
        ========================= */}

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


        {/* =========================
            ACTIVITY
        ========================= */}

        <Route
          path="/activity"
          element={<Activity />}
        />

      </Routes>


      {/* =========================
          TEAMMATE ROUTES
      ========================= */}

      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;