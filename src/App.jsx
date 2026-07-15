import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import ReportIncidentPage from "./pages/ReportIncidentPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

import MobileLayout from "./layouts/MobileLayout";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MobileLayout theme={theme} setTheme={setTheme}>
              <HomePage />
            </MobileLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
           <MobileLayout theme={theme} setTheme={setTheme}>
              <DashboardPage />
            </MobileLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MobileLayout theme={theme} setTheme={setTheme}>
              <SettingsPage />
            </MobileLayout>
          </PrivateRoute>
        }
        
      />

      <Route
  path="/report"
  element={
    <PrivateRoute>
      <MobileLayout theme={theme} setTheme={setTheme}>
        <ReportIncidentPage />
      </MobileLayout>
    </PrivateRoute>
  }
/>

    </Routes>
  );
}

export default App;