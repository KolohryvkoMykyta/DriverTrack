import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/authApi";

import LogoutButton from "../../components/LogoutButton";

import AdminDriversTab from "./AdminDriversTab";
import AdminVehiclesTab from "./AdminVehiclesTab";
import AdminRoutesTab from "./AdminRoutesTab";
import AdminFuelTab from "./AdminFuelTab";
import AdminStatisticsTab from "./AdminStatisticsTab";
import AdminRouteTypesTab from "./AdminRouteTypesTab";
import AdminOverviewTab from "./AdminOverviewTab";

type CurrentUser = {
  id: string;
  email: string;
  role: string;
  driverId: string | null;
  displayName: string;
};

type AdminTab =
  | "overview"
  | "drivers"
  | "vehicles"
  | "routes"
  | "fuel"
  | "routeTypes"
  | "statistics";

function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }

    loadCurrentUser();
  }, []);

  function renderActiveTab() {
    switch (activeTab) {
      case "overview":
        return <AdminOverviewTab />;

      case "drivers":
        return <AdminDriversTab />;

      case "vehicles":
        return <AdminVehiclesTab />;

      case "routes":
        return <AdminRoutesTab />;

      case "fuel":
        return <AdminFuelTab />;

      case "routeTypes":
        return <AdminRouteTypesTab />;

      case "statistics":
        return <AdminStatisticsTab />;

      default:
        return null;
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {currentUser?.displayName}</p>

      <LogoutButton />

      <hr />

      <div>
        <button onClick={() => setActiveTab("overview")}>
          Огляд
        </button>

        <button onClick={() => setActiveTab("drivers")}>
          Drivers
        </button>

        <button onClick={() => setActiveTab("vehicles")}>
          Vehicles
        </button>

        <button onClick={() => setActiveTab("routes")}>
          Routes
        </button>

        <button onClick={() => setActiveTab("fuel")}>
          Fuel
        </button>

        <button onClick={() => setActiveTab("routeTypes")}>
          Route Types
        </button>

        <button onClick={() => setActiveTab("statistics")}>
          Statistics
        </button>
      </div>

      <hr />

      {renderActiveTab()}
    </div>
  );
}

export default AdminDashboardPage;