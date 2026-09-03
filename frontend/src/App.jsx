import { BrowserRouter, Routes, Route } from "react-router-dom";

import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";
import NotificationTest from "./components/notification/NotifiactionTest";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        {/* Temporary notification testing */}
        <Route
          path="/notification-test"
          element={<NotificationTest />}
        />
      </Routes>

      {/* Teammate's routes */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;