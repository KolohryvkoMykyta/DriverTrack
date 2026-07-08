import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/authApi";

import LogoutButton from "../../components/LogoutButton";

import AdminDriversTab from "./AdminDriversTab";
import AdminVehiclesTab from "./AdminVehiclesTab";
import AdminRoutesTab from "./AdminRoutesTab";
import AdminFuelTab from "./AdminFuelTab";
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
  | "routeTypes";

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
          Водії
        </button>

        <button onClick={() => setActiveTab("vehicles")}>
          Автомобілі
        </button>

        <button onClick={() => setActiveTab("routes")}>
          Маршрути
        </button>

        <button onClick={() => setActiveTab("fuel")}>
          Заправки
        </button>

        <button onClick={() => setActiveTab("routeTypes")}>
          Типи маршрутів
        </button>
      </div>

      <hr />

      {renderActiveTab()}
    </div>
  );
}

export default AdminDashboardPage;