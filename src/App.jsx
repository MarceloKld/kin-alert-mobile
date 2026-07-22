import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import ReportIncidentPage from "./pages/ReportIncidentPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

import MobileLayout from "./layouts/MobileLayout";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import MesSignalementsPage from "./pages/MesSignalementsPage";

function App() {

  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />
      {/* Ajoute ta route d'inscription ici */}
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/reset-password" element={<ResetPasswordPage />} />

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

<Route
  path="/incident/:id"
  element={
    <PrivateRoute>
      <MobileLayout>
        <IncidentDetailPage />
      </MobileLayout>
    </PrivateRoute>
  }
/>
<Route
  path="/mes-signalements"
  element={
    <PrivateRoute>
      <MobileLayout>
        <MesSignalementsPage />
      </MobileLayout>
    </PrivateRoute>
  }
/>


    </Routes>
  );
}

export default App;