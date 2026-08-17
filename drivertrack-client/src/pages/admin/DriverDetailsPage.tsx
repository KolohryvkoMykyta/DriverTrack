import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

import DriverDetailsFilters, {
  type DriverDetailsTab,
  type DriverPeriodMode,
} from "./driver-details/DriverDetailsFilters";

import "../../styles/admin-driver-details.css";

import { ArrowLeft } from "lucide-react";

import DriverProfileCard from "./driver-details/DriverProfileCard";

import {
  getDriverById,
  updateDriver,
  type Driver,
} from "../../api/driversApi";
import {
  getVehiclesByDriverId,
  type Vehicle,
} from "../../api/vehiclesApi";
import {
  getRouteEntriesByDriverId,
  type RouteEntry,
} from "../../api/routeEntriesApi";
import {
  getFuelEntriesByDriverId,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import {
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";
import DriverSummaryCards from "./driver-details/DriverSummaryCards";
import DriverDetailsTabs from "./driver-details/DriverDetailsTabs";
import DriverVehiclesPanel from "./driver-details/DriverVehiclesPanel";
import EditDriverModal from "./driver-details/EditDriverModal";
import DriverStatusModal from "./driver-details/DriverStatusModal";
import DriverRoutesPanel from "./driver-details/DriverRoutesPanel";
import DriverFuelPanel from "./driver-details/DriverFuelPanel";
import "../../styles/admin-driver-details-modals.css";
import "../../styles/admin-driver-details-entries.css";

const ROUTES_PAGE_SIZE = 5;
const FUEL_PAGE_SIZE = 5;

function DriverDetailsPage() {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeEntries, setRouteEntries] = useState<RouteEntry[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [
    detailsTab,
    setDetailsTab,
  ] = useState<DriverDetailsTab>(
    "vehicles"
  );

  const [
    periodMode,
    setPeriodMode,
  ] = useState<DriverPeriodMode>(
    "month"
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");
  const [routesPage, setRoutesPage] = useState(1);
  const [fuelPage, setFuelPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [statusErrorMessage, setStatusErrorMessage] = useState("");

  const { setSidebarContent, clearSidebarContent } = useAdminSidebar();

  async function loadDriverDetails() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (!driverId) {
        setErrorMessage("Ідентифікатор водія відсутній.");
        return;
      }

      const [driverData, vehiclesData, routesData, fuelData, routeTypesData] =
        await Promise.all([
          getDriverById(driverId),
          getVehiclesByDriverId(driverId),
          getRouteEntriesByDriverId(driverId),
          getFuelEntriesByDriverId(driverId),
          getRouteTypes(),
        ]);

      setDriver(driverData);
      setVehicles(vehiclesData);
      setRouteEntries(routesData);
      setFuelEntries(fuelData);
      setRouteTypes(routeTypesData);
      setSelectedVehicleId("all");
      setRoutesPage(1);
      setFuelPage(1);
    } catch (error) {
      console.error("Failed to load driver details:", error);
      setErrorMessage("Не вдалося завантажити деталі водія.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDriverDetails();
  }, [driverId]);

  useEffect(() => {
    setSidebarContent(
      <DriverDetailsFilters
        periodMode={periodMode}
        from={from}
        to={to}
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
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
        onVehicleChange={(value) => {
          setSelectedVehicleId(value);
          setRoutesPage(1);
          setFuelPage(1);
        }}
      />
    );

    return () => {
      clearSidebarContent();
    };
  }, [
    detailsTab,
    periodMode,
    from,
    to,
    vehicles,
    selectedVehicleId,
    isLoading,
    setSidebarContent,
    clearSidebarContent,
  ]);

  function getDateString(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function getPeriodDates(mode: DriverPeriodMode) {
    const today = new Date();

    if (mode === "all") {
      return { from: undefined, to: undefined };
    }

    if (mode === "week") {
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);

      return {
        from: getDateString(monday),
        to: getDateString(today),
      };
    }

    if (mode === "month") {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      return {
        from: getDateString(firstDayOfMonth),
        to: getDateString(today),
      };
    }

    return {
      from: from || undefined,
      to: to || undefined,
    };
  }

  function isDateInSelectedPeriod(dateValue: string) {
    const periodDates = getPeriodDates(periodMode);
    const date = new Date(dateValue);

    if (periodDates.from) {
      const fromDate = new Date(periodDates.from);
      fromDate.setHours(0, 0, 0, 0);

      if (date < fromDate) {
        return false;
      }
    }

    if (periodDates.to) {
      const toDate = new Date(periodDates.to);
      toDate.setHours(23, 59, 59, 999);

      if (date > toDate) {
        return false;
      }
    }

    return true;
  }

  async function handleConfirmDriverStatus() {
    if (!driver) {
      return;
    }

    try {
      setIsChangingStatus(true);
      setStatusErrorMessage("");

      await updateDriver(driver.id, {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        isActive: !driver.isActive,
      });

      const updatedDriver =
        await getDriverById(driver.id);

      setDriver(updatedDriver);
      setIsStatusModalOpen(false);
    } catch (error) {
      setStatusErrorMessage(
        getApiErrorMessage(error)
      );
    } finally {
      setIsChangingStatus(false);
    }
  }

  if (isLoading) {
    return <p>Завантаження деталей водія...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <button onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div>
        <button onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <p>Водія не знайдено.</p>
      </div>
    );
  }

  const periodRouteEntries = routeEntries.filter((route) =>
    isDateInSelectedPeriod(route.startDate)
  );

  const periodFuelEntries = fuelEntries.filter((fuel) =>
    isDateInSelectedPeriod(fuel.date)
  );

  const filteredRouteEntries =
    selectedVehicleId === "all"
      ? periodRouteEntries
      : periodRouteEntries.filter(
          (route) => route.vehicleId === selectedVehicleId
        );

  const filteredFuelEntries =
    selectedVehicleId === "all"
      ? periodFuelEntries
      : periodFuelEntries.filter(
          (fuel) => fuel.vehicleId === selectedVehicleId
        );

  const filteredVehicles =
    selectedVehicleId === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.id === selectedVehicleId);

  const summaryRouteCount = filteredRouteEntries.length;
  const summaryDistance = filteredRouteEntries.reduce(
    (sum, route) => sum + (route.totalDistance ?? 0),
    0
  );
  const summaryRevenue = filteredRouteEntries.reduce(
    (sum, route) => sum + route.revenue,
    0
  );
  const summaryDriverPayment = filteredRouteEntries.reduce(
    (sum, route) => sum + route.driverPayment,
    0
  );

  const routesWithFuelData = filteredRouteEntries.filter(
    (route) => route.fuelUsed !== null && route.fuelUsed !== undefined
  );

  const summaryFuelUsed =
    filteredRouteEntries.length === 0
      ? 0
      : routesWithFuelData.length === 0
        ? null
        : routesWithFuelData.reduce(
            (sum, route) => sum + (route.fuelUsed ?? 0),
            0
          );

  const isFuelDataPartial =
    routesWithFuelData.length > 0 &&
    routesWithFuelData.length < filteredRouteEntries.length;

const sortedRouteEntries = [...filteredRouteEntries].sort(
  (a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
);

const totalRoutePages = Math.ceil(
  sortedRouteEntries.length / ROUTES_PAGE_SIZE
);

const pagedRouteEntries = sortedRouteEntries.slice(
  (routesPage - 1) * ROUTES_PAGE_SIZE,
  routesPage * ROUTES_PAGE_SIZE
);

const sortedFuelEntries = [...filteredFuelEntries].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const totalFuelPages = Math.ceil(
  sortedFuelEntries.length / FUEL_PAGE_SIZE
);

const pagedFuelEntries = sortedFuelEntries.slice(
  (fuelPage - 1) * FUEL_PAGE_SIZE,
  fuelPage * FUEL_PAGE_SIZE
);

  return (
    <div className="driver-details-page">
      <Link
        to="/admin/drivers"
        className="driver-details-back"
      >
        <ArrowLeft size={16} />

        Водії
      </Link>

      <DriverProfileCard
        driver={driver}
        isChangingStatus={isChangingStatus}
        onEdit={() => setIsEditModalOpen(true)}
        onToggleStatus={() => {
          setStatusErrorMessage("");
          setIsStatusModalOpen(true);
        }}
      />

      <DriverSummaryCards
        routeCount={summaryRouteCount}
        distance={summaryDistance}
        fuelUsed={summaryFuelUsed}
        isFuelDataPartial={isFuelDataPartial}
        revenue={summaryRevenue}
        driverPayment={summaryDriverPayment}
      />

      <section className="driver-data-section">
        <DriverDetailsTabs
          activeTab={detailsTab}
          onChange={(tab) => {
            setDetailsTab(tab);
            setRoutesPage(1);
            setFuelPage(1);
          }}
        />

        {detailsTab === "vehicles" && (
          <DriverVehiclesPanel vehicles={filteredVehicles} />
        )}

        {detailsTab === "routes" && (
          <DriverRoutesPanel
            routes={pagedRouteEntries}
            vehicles={vehicles}
            routeTypes={routeTypes}
            totalCount={filteredRouteEntries.length}
            currentPage={routesPage}
            totalPages={totalRoutePages}
            onPageChange={setRoutesPage}
          />
        )}

        {detailsTab === "fuel" && (
          <DriverFuelPanel
            fuelEntries={pagedFuelEntries}
            vehicles={vehicles}
            totalCount={filteredFuelEntries.length}
            currentPage={fuelPage}
            totalPages={totalFuelPages}
            onPageChange={setFuelPage}
          />
        )}
      </section>

      {isEditModalOpen && (
        <EditDriverModal
          driver={driver}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={(updatedDriver) => {
            setDriver(updatedDriver);
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isStatusModalOpen && (
        <DriverStatusModal
          driverName={driver.name}
          isActive={driver.isActive}
          isSubmitting={isChangingStatus}
          errorMessage={statusErrorMessage}
          onClose={() => {
            if (!isChangingStatus) {
              setIsStatusModalOpen(false);
              setStatusErrorMessage("");
            }
          }}
          onConfirm={handleConfirmDriverStatus}
        />
      )}
    </div>
  );
}

export default DriverDetailsPage;