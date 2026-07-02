import { Navigate, Route, Routes } from "react-router-dom";
import DriverDetailsPage from "./pages/admin/DriverDetailsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import LoginPage from "./pages/LoginPage";
import VehicleDetailsPage from "./pages/admin/VehicleDetailsPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          token && role === "Admin" ? (
            <AdminDashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/drivers/:driverId"
        element={
          token && role === "Admin" ? (
            <DriverDetailsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/vehicles/:vehicleId"
        element={
          token && role === "Admin" ? (
            <VehicleDetailsPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/driver"
        element={
          token && role === "Driver" ? (
            <DriverDashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={
          token ? (
            role === "Admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/driver" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;