import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CarFront,
  Plus,
} from "lucide-react";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";

import {
  getVehicles,
  type Vehicle,
} from "../../api/vehiclesApi";

import CreateVehicleModal from "./vehicles/CreateVehicleModal";
import VehiclesSummaryCards from "./vehicles/VehiclesSummaryCards";
import VehiclesTable from "./vehicles/VehiclesTable";

import "../../styles/admin-vehicles.css";

function AdminVehiclesTab() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [drivers, setDrivers] =
    useState<DriverListItem[]>([]);

  const [showInactive, setShowInactive] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function loadVehicles() {
    try {
      setErrorMessage("");

      const loadedVehicles =
        await getVehicles();

      setVehicles(loadedVehicles);
    } catch (error) {
      console.error(
        "Не вдалося завантажити автомобілі:",
        error
      );

      setErrorMessage(
        "Не вдалося завантажити список автомобілів."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      try {
        const [loadedVehicles, loadedDrivers] =
          await Promise.all([
            getVehicles(),
            getDrivers(),
          ]);

        if (!isCancelled) {
          setVehicles(loadedVehicles);
          setDrivers(loadedDrivers);
        }
      } catch (error) {
        console.error(
          "Не вдалося завантажити автомобілі:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "Не вдалося завантажити список автомобілів."
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

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.isActive
  );

  const inactiveVehicles = vehicles.filter(
    (vehicle) => !vehicle.isActive
  );

  const visibleVehicles = showInactive
    ? inactiveVehicles
    : activeVehicles;

  return (
    <div className="vehicles-page">
      <section className="vehicles-toolbar">
        <button
          type="button"
          className="vehicles-button vehicles-button--primary"
          onClick={() =>
            setShowCreateModal(true)
          }
        >
          <Plus size={19} />

          Додати автомобіль
        </button>

        <button
          type="button"
          className="vehicles-button vehicles-button--secondary"
          onClick={() =>
            setShowInactive(
              (current) => !current
            )
          }
        >
          <CarFront size={19} />

          {showInactive
            ? "Активні автомобілі"
            : "Неактивні автомобілі"}
        </button>
      </section>

      <VehiclesSummaryCards
        totalCount={vehicles.length}
        activeCount={activeVehicles.length}
        inactiveCount={inactiveVehicles.length}
      />

      {isLoading ? (
        <div className="vehicles-page__message">
          Завантаження автомобілів...
        </div>
      ) : errorMessage ? (
        <div className="vehicles-page__message vehicles-page__message--error">
          <p>{errorMessage}</p>

          <button
            type="button"
            className="vehicles-button vehicles-button--secondary"
            onClick={loadVehicles}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <VehiclesTable
          vehicles={visibleVehicles}
          drivers={drivers}
          emptyMessage={
            showInactive
              ? "Неактивних автомобілів не знайдено."
              : "Активних автомобілів не знайдено."
          }
          onOpenVehicle={(vehicle) =>
            navigate(
              `/admin/vehicles/${vehicle.id}`
            )
          }
        />
      )}

      {showCreateModal && (
        <CreateVehicleModal
          drivers={drivers}
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreated={loadVehicles}
        />
      )}
    </div>
  );
}

export default AdminVehiclesTab;