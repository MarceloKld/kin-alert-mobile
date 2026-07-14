import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import ReportIncidentPage from "./pages/ReportIncidentPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

import MobileLayout from "./layouts/MobileLayout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MobileLayout>
              <HomePage />
            </MobileLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MobileLayout>
              <DashboardPage />
            </MobileLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MobileLayout>
              <SettingsPage />
            </MobileLayout>
          </PrivateRoute>
        }
        
      />

      <Route
  path="/report"
  element={
    <PrivateRoute>
      <MobileLayout>
        <ReportIncidentPage />
      </MobileLayout>
    </PrivateRoute>
  }
/>

    </Routes>
  );
}

export default App;