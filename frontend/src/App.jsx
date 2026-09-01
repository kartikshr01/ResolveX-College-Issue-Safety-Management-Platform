import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";

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

        <Route
          path="*"
          element={<Navigate to="/safety" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;