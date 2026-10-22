import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import DriverLayout from "./layouts/DriverLayout";

import LoginPage from "./pages/LoginPage";
import DriverDashboardPage from "./pages/DriverDashboardPage";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminDriversTab from "./pages/admin/AdminDriversTab";
import AdminVehiclesTab from "./pages/admin/AdminVehiclesTab";
import AdminRoutesTab from "./pages/admin/AdminRoutesTab";
import AdminFuelTab from "./pages/admin/AdminFuelTab";
import AdminRouteTypesTab from "./pages/admin/AdminRouteTypesTab";

import DriverDetailsPage from "./pages/admin/DriverDetailsPage";
import VehicleDetailsPage from "./pages/admin/VehicleDetailsPage";
import RouteDetailsPage from "./pages/admin/RouteDetailsPage";
import FuelDetailsPage from "./pages/admin/FuelDetailsPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = Boolean(token) && role === "Admin";
  const isDriver = Boolean(token) && role === "Driver";

  const homePath = isAdmin
    ? "/admin"
    : isDriver
      ? "/driver"
      : "/login";

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          isAdmin ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<AdminOverviewPage />} />

        <Route path="drivers" element={<AdminDriversTab />} />
        <Route path="vehicles" element={<AdminVehiclesTab />} />
        <Route path="routes" element={<AdminRoutesTab />} />
        <Route path="fuel" element={<AdminFuelTab />} />
        <Route
          path="route-types"
          element={<AdminRouteTypesTab />}
        />

        <Route
          path="drivers/:driverId"
          element={<DriverDetailsPage />}
        />
        <Route
          path="vehicles/:vehicleId"
          element={<VehicleDetailsPage />}
        />
        <Route
          path="routes/:routeId"
          element={<RouteDetailsPage />}
        />
        <Route
          path="fuel/:fuelEntryId"
          element={<FuelDetailsPage />}
        />
      </Route>

      <Route
        path="/driver"
        element={
          isDriver ? (
            <DriverLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DriverDashboardPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={homePath} replace />}
      />
    </Routes>
  );
}

export default App;