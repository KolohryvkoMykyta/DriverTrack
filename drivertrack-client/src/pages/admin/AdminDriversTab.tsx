import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  UserRoundCog,
} from "lucide-react";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";

import CreateDriverModal from "./drivers/CreateDriverModal";
import DriversSummaryCards from "./drivers/DriversSummaryCards";
import DriversTable from "./drivers/DriversTable";

import "../../styles/admin-drivers.css";

function AdminDriversTab() {
  const navigate = useNavigate();

  const [drivers, setDrivers] =
    useState<DriverListItem[]>([]);

  const [
    showInactive,
    setShowInactive,
  ] = useState(false);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function loadDrivers() {
    try {
      setErrorMessage("");

      const loadedDrivers =
        await getDrivers();

      setDrivers(loadedDrivers);
    } catch (error) {
      console.error(
        "Не вдалося завантажити водіїв:",
        error
      );

      setErrorMessage(
        "Не вдалося завантажити список водіїв."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialDrivers() {
      try {
        const loadedDrivers =
          await getDrivers();

        if (!isCancelled) {
          setDrivers(loadedDrivers);
        }
      } catch (error) {
        console.error(
          "Не вдалося завантажити водіїв:",
          error
        );

        if (!isCancelled) {
          setErrorMessage(
            "Не вдалося завантажити список водіїв."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInitialDrivers();

    return () => {
      isCancelled = true;
    };
  }, []);

  const activeDrivers = drivers.filter(
    (driver) => driver.isActive
  );

  const inactiveDrivers = drivers.filter(
    (driver) => !driver.isActive
  );

  const visibleDrivers = showInactive
    ? inactiveDrivers
    : activeDrivers;

  return (
    <div className="drivers-page">
      <section className="drivers-toolbar">
        <button
          type="button"
          className="drivers-button drivers-button--primary"
          onClick={() =>
            setShowCreateModal(true)
          }
        >
          <Plus size={19} />

          Додати водія
        </button>

        <button
          type="button"
          className="drivers-button drivers-button--secondary"
          onClick={() =>
            setShowInactive(
              (current) => !current
            )
          }
        >
          <UserRoundCog size={19} />

          {showInactive
            ? "Активні водії"
            : "Неактивні водії"}
        </button>
      </section>

      <DriversSummaryCards
        totalCount={drivers.length}
        activeCount={
          activeDrivers.length
        }
        inactiveCount={
          inactiveDrivers.length
        }
      />

      {isLoading ? (
        <div className="drivers-page__message">
          Завантаження водіїв...
        </div>
      ) : errorMessage ? (
        <div className="drivers-page__message drivers-page__message--error">
          <p>{errorMessage}</p>

          <button
            type="button"
            className="drivers-button drivers-button--secondary"
            onClick={loadDrivers}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <DriversTable
          drivers={visibleDrivers}
          emptyMessage={
            showInactive
              ? "Неактивних водіїв не знайдено."
              : "Активних водіїв не знайдено."
          }
          onOpenDriver={(driver) =>
            navigate(
              `/admin/drivers/${driver.id}`
            )
          }
        />
      )}

      {showCreateModal && (
        <CreateDriverModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreated={loadDrivers}
        />
      )}
    </div>
  );
}

export default AdminDriversTab;