import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../../api/apiErrorHandler";
import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";
import {
  deleteFuelEntry,
  getFuelEntryById,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import {
  getVehicles,
  type Vehicle,
} from "../../api/vehiclesApi";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

import DeleteFuelModal from "./fuel-details/DeleteFuelModal";
import EditFuelModal from "./fuel-details/EditFuelModal";
import FuelDetailsHeroCard from "./fuel-details/FuelDetailsHeroCard";
import FuelDetailsInformation from "./fuel-details/FuelDetailsInformation";
import FuelDetailsSummary from "./fuel-details/FuelDetailsSummary";

import "../../styles/admin-fuel-details.css";

async function fetchFuelDetailsPageData(fuelEntryId: string) {
  const [entry, drivers, vehicles] = await Promise.all([
    getFuelEntryById(fuelEntryId),
    getDrivers(),
    getVehicles(),
  ]);

  return { entry, drivers, vehicles };
}

function FuelDetailsPage() {
  const { fuelEntryId } = useParams();
  const navigate = useNavigate();
  const { clearSidebarContent } = useAdminSidebar();

  const [entry, setEntry] = useState<FuelEntry | null>(null);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadData = useCallback(async () => {
    if (!fuelEntryId) {
      setErrorMessage("Ідентифікатор заправки відсутній.");
      setIsLoading(false);
      return;
    }

    try {
      setErrorMessage("");
      const data = await fetchFuelDetailsPageData(fuelEntryId);

      setEntry(data.entry);
      setDrivers(data.drivers);
      setVehicles(data.vehicles);
    } catch (error) {
      console.error("Не вдалося завантажити заправку:", error);
      setErrorMessage("Не вдалося завантажити деталі заправки.");
    } finally {
      setIsLoading(false);
    }
  }, [fuelEntryId]);

  useEffect(() => {
    clearSidebarContent();
  }, [clearSidebarContent]);

  useEffect(() => {
    if (!fuelEntryId) {
      const timeoutId = window.setTimeout(() => {
        setErrorMessage("Ідентифікатор заправки відсутній.");
        setIsLoading(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    let isCancelled = false;

    void fetchFuelDetailsPageData(fuelEntryId)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setEntry(data.entry);
        setDrivers(data.drivers);
        setVehicles(data.vehicles);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Не вдалося завантажити заправку:", error);

        if (!isCancelled) {
          setErrorMessage("Не вдалося завантажити деталі заправки.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [fuelEntryId]);

  const driverName = useMemo(
    () =>
      drivers.find((driver) => driver.id === entry?.driverId)?.name ??
      "Невідомий водій",
    [drivers, entry?.driverId]
  );

  const vehicle = useMemo(
    () => vehicles.find((item) => item.id === entry?.vehicleId),
    [vehicles, entry?.vehicleId]
  );

  async function handleDelete() {
    if (!fuelEntryId) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteFuelEntry(fuelEntryId);
      navigate("/admin/fuel");
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="fuel-details-message">
        <RefreshCw className="fuel-details-spinner" size={24} />
        Завантаження заправки...
      </div>
    );
  }

  if (!entry || errorMessage) {
    return (
      <div className="fuel-details-page">
        <Link className="fuel-details-back" to="/admin/fuel">
          <ArrowLeft size={16} />
          Заправки
        </Link>

        <div className="fuel-details-message fuel-details-message--error">
          <p>{errorMessage || "Заправку не знайдено."}</p>
          <button type="button" onClick={() => void loadData()}>
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  const vehicleName = vehicle
    ? `${vehicle.brand} ${vehicle.model}`
    : "Невідомий автомобіль";
  const licensePlate = vehicle?.licensePlate ?? "Номер відсутній";

  return (
    <div className="fuel-details-page">
      <Link className="fuel-details-back" to="/admin/fuel">
        <ArrowLeft size={16} />
        Заправки
      </Link>

      <FuelDetailsHeroCard
        entry={entry}
        driverName={driverName}
        vehicleName={vehicleName}
        licensePlate={licensePlate}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => {
          setDeleteError("");
          setIsDeleteOpen(true);
        }}
      />

      <FuelDetailsSummary entry={entry} />

      <FuelDetailsInformation
        entry={entry}
        driverName={driverName}
        vehicleName={vehicleName}
        licensePlate={licensePlate}
        vehicleAverageConsumption={vehicle?.averageFuelConsumption ?? null}
      />

      {isEditOpen && (
        <EditFuelModal
          entry={entry}
          onClose={() => setIsEditOpen(false)}
          onUpdated={loadData}
        />
      )}

      {isDeleteOpen && (
        <DeleteFuelModal
          vehicleName={vehicleName}
          isDeleting={isDeleting}
          errorMessage={deleteError}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteOpen(false);
            }
          }}
          onConfirm={() => void handleDelete()}
        />
      )}
    </div>
  );
}

export default FuelDetailsPage;
