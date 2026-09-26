import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";

import {
  getFuelEntriesByVehicleId,
  type FuelEntry,
} from "../../api/fuelEntriesApi";

import {
  getRouteEntriesByVehicleId,
  type RouteEntry,
} from "../../api/routeEntriesApi";

import {
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";

import {
  getVehicleById,
  type Vehicle,
} from "../../api/vehiclesApi";

import {
  useAdminSidebar,
} from "../../contexts/AdminSidebarContext";

import VehicleDataPanel, {
  type VehicleDetailsTab,
} from "./vehicle-details/VehicleDataPanel";

import VehicleDetailsFilters, {
  type VehiclePeriodMode,
} from "./vehicle-details/VehicleDetailsFilters";

import VehicleProfileCard from "./vehicle-details/VehicleProfileCard";
import VehicleSummaryCards from "./vehicle-details/VehicleSummaryCards";

import "../../styles/admin-vehicle-details.css";

const ROUTES_PAGE_SIZE = 5;
const FUEL_PAGE_SIZE = 5;

function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const {
    setSidebarContent,
    clearSidebarContent,
  } = useAdminSidebar();

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [drivers, setDrivers] =
    useState<DriverListItem[]>([]);

  const [routeEntries, setRouteEntries] =
    useState<RouteEntry[]>([]);

  const [fuelEntries, setFuelEntries] =
    useState<FuelEntry[]>([]);

  const [routeTypes, setRouteTypes] =
    useState<RouteType[]>([]);

  const [detailsTab, setDetailsTab] =
    useState<VehicleDetailsTab>("routes");

  const [periodMode, setPeriodMode] =
    useState<VehiclePeriodMode>("all");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [routesPage, setRoutesPage] =
    useState(1);

  const [fuelPage, setFuelPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadVehicleDetails() {
      try {
        setErrorMessage("");

        if (!vehicleId) {
          if (!isCancelled) {
            setErrorMessage(
              "Ідентифікатор автомобіля відсутній."
            );
          }

          return;
        }

        const [
          vehicleData,
          driversData,
          routesData,
          fuelData,
          routeTypesData,
        ] = await Promise.all([
          getVehicleById(vehicleId),
          getDrivers(),
          getRouteEntriesByVehicleId(
            vehicleId
          ),
          getFuelEntriesByVehicleId(
            vehicleId
          ),
          getRouteTypes(),
        ]);

        if (!isCancelled) {
          setVehicle(vehicleData);
          setDrivers(driversData);
          setRouteEntries(routesData);
          setFuelEntries(fuelData);
          setRouteTypes(routeTypesData);
          setRoutesPage(1);
          setFuelPage(1);
        }
      } catch (error) {
        console.error(
          "Не вдалося завантажити деталі автомобіля:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "Не вдалося завантажити деталі автомобіля."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadVehicleDetails();

    return () => {
      isCancelled = true;
    };
  }, [vehicleId]);

  useEffect(() => {
    setSidebarContent(
      <VehicleDetailsFilters
        periodMode={periodMode}
        from={from}
        to={to}
        isLoading={isLoading}
        onPeriodModeChange={(mode) => {
          setPeriodMode(mode);
          setRoutesPage(1);
          setFuelPage(1);
        }}
        onFromChange={(value) => {
          setFrom(value);
          setRoutesPage(1);
          setFuelPage(1);
        }}
        onToChange={(value) => {
          setTo(value);
          setRoutesPage(1);
          setFuelPage(1);
        }}
      />
    );

    return () => {
      clearSidebarContent();
    };
  }, [
    periodMode,
    from,
    to,
    isLoading,
    setSidebarContent,
    clearSidebarContent,
  ]);

  function getDateString(date: Date) {
    return date
      .toISOString()
      .split("T")[0];
  }

  function getPeriodDates(
    mode: VehiclePeriodMode
  ) {
    const today = new Date();

    if (mode === "all") {
      return {
        from: undefined,
        to: undefined,
      };
    }

    if (mode === "week") {
      const currentDay = today.getDay();

      const mondayOffset =
        currentDay === 0
          ? -6
          : 1 - currentDay;

      const monday = new Date(today);

      monday.setDate(
        today.getDate() + mondayOffset
      );

      return {
        from: getDateString(monday),
        to: getDateString(today),
      };
    }

    if (mode === "month") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        from: getDateString(
          firstDayOfMonth
        ),
        to: getDateString(today),
      };
    }

    return {
      from: from || undefined,
      to: to || undefined,
    };
  }

  function isDateInSelectedPeriod(
    dateValue: string
  ) {
    const periodDates =
      getPeriodDates(periodMode);

    const date = new Date(dateValue);

    if (periodDates.from) {
      const fromDate = new Date(
        periodDates.from
      );

      fromDate.setHours(0, 0, 0, 0);

      if (date < fromDate) {
        return false;
      }
    }

    if (periodDates.to) {
      const toDate = new Date(
        periodDates.to
      );

      toDate.setHours(23, 59, 59, 999);

      if (date > toDate) {
        return false;
      }
    }

    return true;
  }

  if (isLoading) {
    return (
      <div className="vehicle-details-message">
        Завантаження деталей автомобіля...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="vehicle-details-message vehicle-details-message--error">
        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Назад
        </button>

        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-details-message">
        Автомобіль не знайдено.
      </div>
    );
  }

  const periodRouteEntries =
    routeEntries.filter((route) =>
      isDateInSelectedPeriod(
        route.startDate
      )
    );

  const periodFuelEntries =
    fuelEntries.filter((fuelEntry) =>
      isDateInSelectedPeriod(
        fuelEntry.date
      )
    );

  const summaryDistance =
    periodRouteEntries.reduce(
      (sum, route) =>
        sum + (route.totalDistance ?? 0),
      0
    );

  const summaryFuelUsed =
    periodRouteEntries.reduce(
      (sum, route) =>
        sum + (route.fuelUsed ?? 0),
      0
    );

  const summaryAverageConsumption =
    summaryDistance > 0
      ? (
          summaryFuelUsed /
          summaryDistance
        ) * 100
      : null;

  const summaryRevenue =
    periodRouteEntries.reduce(
      (sum, route) =>
        sum + route.revenue,
      0
    );

  const sortedRouteEntries = [
    ...periodRouteEntries,
  ].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  );

  const sortedFuelEntries = [
    ...periodFuelEntries,
  ].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  const totalRoutePages = Math.ceil(
    sortedRouteEntries.length /
      ROUTES_PAGE_SIZE
  );

  const totalFuelPages = Math.ceil(
    sortedFuelEntries.length /
      FUEL_PAGE_SIZE
  );

  const pagedRouteEntries =
    sortedRouteEntries.slice(
      (routesPage - 1) *
        ROUTES_PAGE_SIZE,
      routesPage * ROUTES_PAGE_SIZE
    );

  const pagedFuelEntries =
    sortedFuelEntries.slice(
      (fuelPage - 1) * FUEL_PAGE_SIZE,
      fuelPage * FUEL_PAGE_SIZE
    );

  return (
    <div className="vehicle-details-page">
      <Link
        to="/admin/vehicles"
        className="vehicle-details-back"
      >
        <ArrowLeft size={16} />

        Автомобілі
      </Link>

      <VehicleProfileCard
        vehicle={vehicle}
        drivers={drivers}
        onUpdated={setVehicle}
      />

      <VehicleSummaryCards
        routeCount={
          periodRouteEntries.length
        }
        distance={summaryDistance}
        fuelUsed={summaryFuelUsed}
        averageConsumption={
          summaryAverageConsumption
        }
        revenue={summaryRevenue}
      />

      <VehicleDataPanel
        activeTab={detailsTab}
        routes={pagedRouteEntries}
        fuelEntries={pagedFuelEntries}
        routeTypes={routeTypes}
        drivers={drivers}
        routesTotalCount={
          sortedRouteEntries.length
        }
        fuelTotalCount={
          sortedFuelEntries.length
        }
        routesCurrentPage={routesPage}
        routesTotalPages={totalRoutePages}
        fuelCurrentPage={fuelPage}
        fuelTotalPages={totalFuelPages}
        onTabChange={(tab) => {
          setDetailsTab(tab);
          setRoutesPage(1);
          setFuelPage(1);
        }}
        onRoutesPageChange={
          setRoutesPage
        }
        onFuelPageChange={setFuelPage}
      />
    </div>
  );
}

export default VehicleDetailsPage;