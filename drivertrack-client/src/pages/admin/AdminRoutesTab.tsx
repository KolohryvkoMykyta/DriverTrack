import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";

import {
  getRouteEntries,
  type RouteEntry,
} from "../../api/routeEntriesApi";

import {
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";

import {
  getVehicles,
  type Vehicle,
} from "../../api/vehiclesApi";

import {
  useAdminSidebar,
} from "../../contexts/AdminSidebarContext";

import CreateRouteModal from "./routes/CreateRouteModal";

import RoutesFilters, {
  type RoutesPeriodMode,
} from "./routes/RoutesFilters";

import RoutesSummaryCards from "./routes/RoutesSummaryCards";
import RoutesTable from "./routes/RoutesTable";

import "../../styles/admin-routes.css";

const ROUTES_PAGE_SIZE = 5;

function AdminRoutesTab() {
  const navigate = useNavigate();

  const {
    setSidebarContent,
    clearSidebarContent,
  } = useAdminSidebar();

  const [routeEntries, setRouteEntries] =
    useState<RouteEntry[]>([]);

  const [drivers, setDrivers] =
    useState<DriverListItem[]>([]);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [routeTypes, setRouteTypes] =
    useState<RouteType[]>([]);

  const [periodMode, setPeriodMode] =
    useState<RoutesPeriodMode>("all");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [
    selectedDriverId,
    setSelectedDriverId,
  ] = useState("all");

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] = useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function reloadRoutes() {
    try {
      setErrorMessage("");

      const loadedRoutes =
        await getRouteEntries();

      setRouteEntries(loadedRoutes);
    } catch (error) {
      console.error(
        "Не вдалося завантажити маршрути:",
        error
      );

      setErrorMessage(
        "Не вдалося завантажити список маршрутів."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      try {
        const [
          loadedRoutes,
          loadedDrivers,
          loadedVehicles,
          loadedRouteTypes,
        ] = await Promise.all([
          getRouteEntries(),
          getDrivers(),
          getVehicles(),
          getRouteTypes(),
        ]);

        if (!isCancelled) {
          setRouteEntries(loadedRoutes);
          setDrivers(loadedDrivers);
          setVehicles(loadedVehicles);
          setRouteTypes(
            loadedRouteTypes
          );
        }
      } catch (error) {
        console.error(
          "Не вдалося завантажити маршрути:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "Не вдалося завантажити список маршрутів."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const availableVehicles = useMemo(
    () => {
      if (
        selectedDriverId === "all"
      ) {
        return vehicles;
      }

      const driverVehicleIds =
        new Set(
          routeEntries
            .filter(
              (route) =>
                route.driverId ===
                selectedDriverId
            )
            .map(
              (route) =>
                route.vehicleId
            )
        );

      return vehicles.filter(
        (vehicle) =>
          driverVehicleIds.has(
            vehicle.id
          )
      );
    },
    [
      routeEntries,
      vehicles,
      selectedDriverId,
    ]
  );

  useEffect(() => {
    setSidebarContent(
      <RoutesFilters
        periodMode={periodMode}
        from={from}
        to={to}
        drivers={drivers}
        vehicles={availableVehicles}
        selectedDriverId={
          selectedDriverId
        }
        selectedVehicleId={
          selectedVehicleId
        }
        isLoading={isLoading}
        onPeriodModeChange={(mode) => {
          setPeriodMode(mode);
          setCurrentPage(1);
        }}
        onFromChange={(value) => {
          setFrom(value);
          setCurrentPage(1);
        }}
        onToChange={(value) => {
          setTo(value);
          setCurrentPage(1);
        }}
        onDriverChange={(value) => {
          setSelectedDriverId(value);
          setSelectedVehicleId("all");
          setCurrentPage(1);
        }}
        onVehicleChange={(value) => {
          setSelectedVehicleId(value);
          setCurrentPage(1);
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
    drivers,
    availableVehicles,
    selectedDriverId,
    selectedVehicleId,
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
    mode: RoutesPeriodMode
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

  const filteredRoutes =
    routeEntries.filter((route) => {
      const matchesPeriod =
        isDateInSelectedPeriod(
          route.startDate
        );

      const matchesDriver =
        selectedDriverId === "all" ||
        route.driverId ===
          selectedDriverId;

      const matchesVehicle =
        selectedVehicleId === "all" ||
        route.vehicleId ===
          selectedVehicleId;

      return (
        matchesPeriod &&
        matchesDriver &&
        matchesVehicle
      );
    });

  const sortedRoutes = [
    ...filteredRoutes,
  ].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  );

  const totalPages = Math.ceil(
    sortedRoutes.length /
      ROUTES_PAGE_SIZE
  );

  const pagedRoutes = sortedRoutes.slice(
    (currentPage - 1) *
      ROUTES_PAGE_SIZE,
    currentPage * ROUTES_PAGE_SIZE
  );

  const summaryDistance =
    filteredRoutes.reduce(
      (sum, route) =>
        sum +
        (route.totalDistance ?? 0),
      0
    );

  const summaryFuelUsed =
    filteredRoutes.reduce(
      (sum, route) =>
        sum + (route.fuelUsed ?? 0),
      0
    );

  const summaryRevenue =
    filteredRoutes.reduce(
      (sum, route) =>
        sum + route.revenue,
      0
    );

  const summaryDriverPayment =
    filteredRoutes.reduce(
      (sum, route) =>
        sum + route.driverPayment,
      0
    );

  return (
    <div className="routes-page">
      <section className="routes-toolbar">
        <button
          type="button"
          className="routes-button routes-button--primary"
          onClick={() =>
            setShowCreateModal(true)
          }
        >
          <Plus size={19} />

          Додати маршрут
        </button>
      </section>

      <RoutesSummaryCards
        routeCount={
          filteredRoutes.length
        }
        distance={summaryDistance}
        fuelUsed={summaryFuelUsed}
        revenue={summaryRevenue}
        driverPayment={
          summaryDriverPayment
        }
      />

      {isLoading ? (
        <div className="routes-page__message">
          Завантаження маршрутів...
        </div>
      ) : errorMessage ? (
        <div className="routes-page__message routes-page__message--error">
          <p>{errorMessage}</p>

          <button
            type="button"
            className="routes-button routes-button--secondary"
            onClick={reloadRoutes}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <RoutesTable
          routes={pagedRoutes}
          drivers={drivers}
          vehicles={vehicles}
          routeTypes={routeTypes}
          totalCount={
            filteredRoutes.length
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onOpenRoute={(route) =>
            navigate(
              `/admin/routes/${route.id}`
            )
          }
          onPageChange={setCurrentPage}
        />
      )}

      {showCreateModal && (
        <CreateRouteModal
          drivers={drivers}
          vehicles={vehicles}
          routeTypes={routeTypes}
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreated={async () => {
            await reloadRoutes();
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}

export default AdminRoutesTab;