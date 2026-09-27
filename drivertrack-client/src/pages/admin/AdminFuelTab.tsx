import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";
import {
  getFuelEntries,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import {
  getVehicles,
  type Vehicle,
} from "../../api/vehiclesApi";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

import CreateFuelModal from "./fuel/CreateFuelModal";
import FuelFilters, {
  type FuelPeriodMode,
} from "./fuel/FuelFilters";
import FuelSummaryCards from "./fuel/FuelSummaryCards";
import FuelTable from "./fuel/FuelTable";

import "../../styles/admin-fuel.css";

const FUEL_PAGE_SIZE = 5;

function AdminFuelTab() {
  const navigate = useNavigate();
  const { setSidebarContent, clearSidebarContent } =
    useAdminSidebar();

  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [periodMode, setPeriodMode] =
    useState<FuelPeriodMode>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("all");
  const [selectedVehicleId, setSelectedVehicleId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadFuelEntries() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [loadedDrivers, loadedVehicles, loadedEntries] =
        await Promise.all([
          getDrivers(),
          getVehicles(),
          getFuelEntries(),
        ]);

      setDrivers(loadedDrivers);
      setVehicles(loadedVehicles);
      setFuelEntries(loadedEntries);
    } catch (error) {
      console.error("Не вдалося завантажити заправки:", error);
      setErrorMessage("Не вдалося завантажити список заправок.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      try {
        const [loadedDrivers, loadedVehicles, loadedEntries] =
          await Promise.all([
            getDrivers(),
            getVehicles(),
            getFuelEntries(),
          ]);

        if (!isCancelled) {
          setDrivers(loadedDrivers);
          setVehicles(loadedVehicles);
          setFuelEntries(loadedEntries);
        }
      } catch (error) {
        console.error("Не вдалося завантажити заправки:", error);

        if (!isCancelled) {
          setErrorMessage("Не вдалося завантажити список заправок.");
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

  const availableVehicles = useMemo(() => {
    if (selectedDriverId === "all") {
      return vehicles;
    }

    const driverVehicleIds = new Set(
      fuelEntries
        .filter((entry) => entry.driverId === selectedDriverId)
        .map((entry) => entry.vehicleId)
    );

    return vehicles.filter((vehicle) => driverVehicleIds.has(vehicle.id));
  }, [fuelEntries, vehicles, selectedDriverId]);

  useEffect(() => {
    setSidebarContent(
      <FuelFilters
        periodMode={periodMode}
        from={from}
        to={to}
        drivers={drivers}
        vehicles={availableVehicles}
        selectedDriverId={selectedDriverId}
        selectedVehicleId={selectedVehicleId}
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getPeriodDates(mode: FuelPeriodMode) {
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
      const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        from: getDateString(firstDay),
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

  const filteredEntries = fuelEntries.filter((entry) => {
    const matchesPeriod = isDateInSelectedPeriod(entry.date);
    const matchesDriver =
      selectedDriverId === "all" || entry.driverId === selectedDriverId;
    const matchesVehicle =
      selectedVehicleId === "all" || entry.vehicleId === selectedVehicleId;

    return matchesPeriod && matchesDriver && matchesVehicle;
  });

  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const totalPages = Math.ceil(sortedEntries.length / FUEL_PAGE_SIZE);
  const pagedEntries = sortedEntries.slice(
    (currentPage - 1) * FUEL_PAGE_SIZE,
    currentPage * FUEL_PAGE_SIZE
  );

  const totalLiters = filteredEntries.reduce(
    (sum, entry) => sum + entry.liters,
    0
  );
  const fullTankCount = filteredEntries.filter(
    (entry) => entry.isFullTank
  ).length;
  const averageRefuel =
    filteredEntries.length > 0
      ? totalLiters / filteredEntries.length
      : null;

  const calculatedEntries = filteredEntries.filter(
    (entry) =>
      entry.distanceSinceLastRefuel !== null &&
      entry.distanceSinceLastRefuel !== undefined &&
      entry.distanceSinceLastRefuel > 0 &&
      entry.fuelConsumption !== null &&
      entry.fuelConsumption !== undefined
  );
  const consumptionDistance = calculatedEntries.reduce(
    (sum, entry) => sum + (entry.distanceSinceLastRefuel ?? 0),
    0
  );
  const weightedConsumption =
    consumptionDistance > 0
      ? calculatedEntries.reduce(
          (sum, entry) =>
            sum +
            (entry.fuelConsumption ?? 0) *
              (entry.distanceSinceLastRefuel ?? 0),
          0
        ) / consumptionDistance
      : null;

  return (
    <div className="fuel-page">
      <section className="fuel-toolbar">
        <button
          type="button"
          className="fuel-button fuel-button--primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={19} />
          Додати заправку
        </button>
      </section>

      <FuelSummaryCards
        entryCount={filteredEntries.length}
        totalLiters={totalLiters}
        fullTankCount={fullTankCount}
        averageRefuel={averageRefuel}
        averageConsumption={weightedConsumption}
      />

      {isLoading ? (
        <div className="fuel-page__message">Завантаження заправок...</div>
      ) : errorMessage ? (
        <div className="fuel-page__message fuel-page__message--error">
          <p>{errorMessage}</p>
          <button
            type="button"
            className="fuel-button fuel-button--secondary"
            onClick={reloadFuelEntries}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <FuelTable
          entries={pagedEntries}
          drivers={drivers}
          vehicles={vehicles}
          totalCount={filteredEntries.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onOpenEntry={(entry) => navigate(`/admin/fuel/${entry.id}`)}
          onPageChange={setCurrentPage}
        />
      )}

      {showCreateModal && (
        <CreateFuelModal
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => setShowCreateModal(false)}
          onCreated={async () => {
            await reloadFuelEntries();
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}

export default AdminFuelTab;
