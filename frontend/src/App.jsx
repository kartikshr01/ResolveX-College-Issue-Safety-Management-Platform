import { BrowserRouter, Routes, Route } from "react-router-dom";

import SafetyFeed from "./components/safety/SafetyFeed";
import SafetyDetails from "./components/safety/SafetyDetails";
import Activity from "./components/activity/Activity";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>

      {/* Your routes */}
      <Routes>
        {/* <Route path="/" element={<SafetyFeed />} />

        <Route path="/safety" element={<SafetyFeed />} />

        <Route
          path="/safety/:id"
          element={<SafetyDetails />}
        /> */}

        {/* <Route
          path="/activity"
          element={<Activity />}
        /> */}
      </Routes>

      {/* Teammate's routes */}
      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;