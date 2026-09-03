import { BrowserRouter, Routes, Route } from "react-router-dom";

import TechnicianDashboard from "./pages/TechnicianDashboard/TechnicianDashboard";
import TicketDetails from "./pages/TicketDetails/TicketDetails";

import "./App.css";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;