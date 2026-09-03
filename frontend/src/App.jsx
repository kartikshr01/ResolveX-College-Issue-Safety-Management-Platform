import { BrowserRouter, Routes, Route } from "react-router-dom";

import TechnicianDashboard from "./pages/TechnicianDashboard/TechnicianDashboard";
import TicketDetails from "./pages/TicketDetails/TicketDetails";

import "./App.css";
import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/technician"
          element={<TechnicianDashboard />}
        />

        <Route
          path="/technician/ticket/:ticketId"
          element={<TicketDetails />}
        />
        
        <Route path="/" element={<SafetyFeed />} />

        <Route path="/safety" element={<SafetyFeed />} />

        <Route
          path="/safety/:id"
          element={<SafetyDetails />}
        />

        <Route
          path="/activity"
          element={<Activity />}
        />
      </Routes>

      {/* Teammate's routes */}
      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;