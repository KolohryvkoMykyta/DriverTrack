import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import {
  getVehicleById,
  updateVehicle,
  type Vehicle,
} from "../../api/vehiclesApi";
import {
  getRouteEntriesByVehicleId,
  type RouteEntry,
} from "../../api/routeEntriesApi";
import {
  getFuelEntriesByVehicleId,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

const ROUTES_PAGE_SIZE = 5;
const FUEL_PAGE_SIZE = 5;

type DetailsTab = "routes" | "fuel";
type PeriodMode = "week" | "month" | "all" | "custom";

function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routeEntries, setRouteEntries] = useState<RouteEntry[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);

  const [detailsTab, setDetailsTab] = useState<DetailsTab>("routes");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [routesPage, setRoutesPage] = useState(1);
  const [fuelPage, setFuelPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editBrand, setEditBrand] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editLicensePlate, setEditLicensePlate] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editDriverId, setEditDriverId] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  async function loadVehicleDetails() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (!vehicleId) {
        setErrorMessage("Ідентифікатор автомобіля відсутній.");
        return;
      }

      const [vehicleData, driversData, routesData, fuelData] =
        await Promise.all([
          getVehicleById(vehicleId),
          getDrivers(),
          getRouteEntriesByVehicleId(vehicleId),
          getFuelEntriesByVehicleId(vehicleId),
        ]);

      setVehicle(vehicleData);
      setDrivers(driversData);
      setRouteEntries(routesData);
      setFuelEntries(fuelData);
      setRoutesPage(1);
      setFuelPage(1);
    } catch (error) {
      console.error("Failed to load vehicle details:", error);
      setErrorMessage("Не вдалося завантажити деталі автомобіля.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVehicleDetails();
  }, [vehicleId]);

  function getDateString(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function getPeriodDates(mode: PeriodMode) {
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

  function changePeriodMode(mode: PeriodMode) {
    setPeriodMode(mode);
    setRoutesPage(1);
    setFuelPage(1);
  }

  function getDriverName(driverId: string | null) {
    if (!driverId) {
      return "Не призначено";
    }

    const driver = drivers.find((driver) => driver.id === driverId);

    return driver?.name ?? "Невідомий водій";
  }

  function startEditing() {
    if (!vehicle) {
      return;
    }

    setEditBrand(vehicle.brand);
    setEditModel(vehicle.model);
    setEditLicensePlate(vehicle.licensePlate);
    setEditIsActive(vehicle.isActive);
    setEditDriverId(vehicle.driverId ?? "");
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditErrorMessage("");
  }

  async function handleUpdateVehicle(event: React.FormEvent) {
    event.preventDefault();

    if (!vehicle) {
      return;
    }

    try {
      setEditErrorMessage("");

      await updateVehicle(vehicle.id, {
        brand: editBrand,
        model: editModel,
        licensePlate: editLicensePlate,
        isActive: editIsActive,
        driverId: editDriverId || null,
      });

      const updatedVehicle = await getVehicleById(vehicle.id);
      setVehicle(updatedVehicle);
      setIsEditing(false);
    } catch (error) {
      setEditErrorMessage(getApiErrorMessage(error));
    }
  }

  function formatDate(value: string | null | undefined) {
    if (!value) {
      return "Не завершено";
    }

    return new Date(value).toLocaleString("uk-UA");
  }

  function formatNumber(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return "Немає даних";
    }

    return value.toFixed(2);
  }

  function getPeriodButtonStyle(mode: PeriodMode) {
    return {
      fontWeight: periodMode === mode ? "bold" : "normal",
    };
  }

  function getDetailsTabButtonStyle(tab: DetailsTab) {
    return {
      fontWeight: detailsTab === tab ? "bold" : "normal",
    };
  }

  if (isLoading) {
    return <p>Завантаження деталей автомобіля...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <button onClick={() => navigate(-1)}>← Назад</button>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div>
        <button onClick={() => navigate(-1)}>← Назад</button>
        <p>Автомобіль не знайдено.</p>
      </div>
    );
  }

  const periodRouteEntries = routeEntries.filter((route) =>
    isDateInSelectedPeriod(route.startDate)
  );

  const periodFuelEntries = fuelEntries.filter((fuel) =>
    isDateInSelectedPeriod(fuel.date)
  );

  const summaryRouteCount = periodRouteEntries.length;
  const summaryDistance = periodRouteEntries.reduce(
    (sum, route) => sum + (route.totalDistance ?? 0),
    0
  );
  const summaryFuelUsed = periodRouteEntries.reduce(
    (sum, route) => sum + (route.fuelUsed ?? 0),
    0
  );

const summaryAverageFuelConsumption = summaryDistance > 0 ? (summaryFuelUsed / summaryDistance) * 100 : null;

  const sortedRouteEntries = [...periodRouteEntries].sort(
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

  const sortedFuelEntries = [...periodFuelEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalFuelPages = Math.ceil(sortedFuelEntries.length / FUEL_PAGE_SIZE);

  const pagedFuelEntries = sortedFuelEntries.slice(
    (fuelPage - 1) * FUEL_PAGE_SIZE,
    fuelPage * FUEL_PAGE_SIZE
  );

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Назад</button>

      <h2>Деталі автомобіля</h2>

      {!isEditing && (
        <div>
          <h3>
            {vehicle.brand} {vehicle.model}
          </h3>

          <p>
            <strong>Номер:</strong> {vehicle.licensePlate}
          </p>

          <p>
            <strong>Статус:</strong>{" "}
            {vehicle.isActive ? "Активний" : "Неактивний"}
          </p>

          <p>
            <strong>Водій:</strong> {getDriverName(vehicle.driverId)}
          </p>

          <p>
            <strong>Середня витрата пального:</strong>{" "}
            {vehicle.averageFuelConsumption === null ||
            vehicle.averageFuelConsumption === undefined
              ? "Немає даних"
              : `${vehicle.averageFuelConsumption} л / 100 км`}
          </p>

          <button type="button" onClick={startEditing}>
            Редагувати
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleUpdateVehicle}>
          <h3>Редагування автомобіля</h3>

          <div>
            <label>Марка</label>
            <br />
            <input
              value={editBrand}
              onChange={(event) => setEditBrand(event.target.value)}
            />
          </div>

          <div>
            <label>Модель</label>
            <br />
            <input
              value={editModel}
              onChange={(event) => setEditModel(event.target.value)}
            />
          </div>

          <div>
            <label>Номер</label>
            <br />
            <input
              value={editLicensePlate}
              onChange={(event) => setEditLicensePlate(event.target.value)}
            />
          </div>

          <div>
            <label>Статус</label>
            <br />
            <select
              value={editIsActive ? "active" : "inactive"}
              onChange={(event) =>
                setEditIsActive(event.target.value === "active")
              }
            >
              <option value="active">Активний</option>
              <option value="inactive">Неактивний</option>
            </select>
          </div>

          <div>
            <label>Водій</label>
            <br />
            <select
              value={editDriverId}
              onChange={(event) => setEditDriverId(event.target.value)}
            >
              <option value="">Не призначено</option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          {editErrorMessage && (
            <p style={{ color: "red" }}>{editErrorMessage}</p>
          )}

          <button type="submit">Зберегти</button>
          <button type="button" onClick={cancelEditing}>
            Скасувати
          </button>
        </form>
      )}

      <hr />

      <h3>Період</h3>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          style={getPeriodButtonStyle("week")}
          onClick={() => changePeriodMode("week")}
        >
          Поточний тиждень
        </button>

        <button
          style={getPeriodButtonStyle("month")}
          onClick={() => changePeriodMode("month")}
        >
          Поточний місяць
        </button>

        <button
          style={getPeriodButtonStyle("all")}
          onClick={() => changePeriodMode("all")}
        >
          Весь час
        </button>

        <button
          style={getPeriodButtonStyle("custom")}
          onClick={() => changePeriodMode("custom")}
        >
          Власний період
        </button>
      </div>

      {periodMode === "custom" && (
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <div>
            <label>З дати</label>
            <br />
            <input
              type="date"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setRoutesPage(1);
                setFuelPage(1);
              }}
            />
          </div>

          <div>
            <label>По дату</label>
            <br />
            <input
              type="date"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setRoutesPage(1);
                setFuelPage(1);
              }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h4>Маршрутів</h4>
          <p>{summaryRouteCount}</p>
        </div>

        <div>
          <h4>Пробіг</h4>
          <p>{formatNumber(summaryDistance)} км</p>
        </div>

        <div>
            <h4>Витрачено пального</h4>
            <p>{formatNumber(summaryFuelUsed)} л</p>
        </div>

        <div>
            <h4>Середня витрата</h4>
            <p>
                {summaryAverageFuelConsumption === null
                ? "Немає даних"
                : `${summaryAverageFuelConsumption.toFixed(2)} л / 100 км`}
            </p>
        </div>
      </div>

      <hr />

      <h3>Дані автомобіля</h3>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          style={getDetailsTabButtonStyle("routes")}
          onClick={() => setDetailsTab("routes")}
        >
          Маршрути
        </button>

        <button
          style={getDetailsTabButtonStyle("fuel")}
          onClick={() => setDetailsTab("fuel")}
        >
          Заправки
        </button>
      </div>

      {detailsTab === "routes" && (
        <>
          <h3>Маршрути</h3>

          {periodRouteEntries.length === 0 && <p>Маршрути не знайдено.</p>}

          {pagedRouteEntries.map((route) => (
            <div
              key={route.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "8px",
              }}
            >
              <p>
                <strong>Дата початку:</strong> {formatDate(route.startDate)}
              </p>

              <p>
                <strong>Дата завершення:</strong> {formatDate(route.endDate)}
              </p>

              <p>
                <strong>Пробіг:</strong> {formatNumber(route.totalDistance)} км
              </p>

              <p>
                <strong>Використано пального:</strong>{" "}
                {formatNumber(route.fuelUsed)} л
              </p>

              <p>
                <strong>Дохід компанії:</strong>{" "}
                {formatNumber(route.revenue)} грн
              </p>

              <p>
                <strong>Зарплата водія:</strong>{" "}
                {formatNumber(route.driverPayment)} грн
              </p>
            </div>
          ))}

          {totalRoutePages > 1 && (
            <div>
              <button
                disabled={routesPage === 1}
                onClick={() => setRoutesPage(routesPage - 1)}
              >
                Попередня
              </button>

              <span>
                {" "}
                Сторінка {routesPage} з {totalRoutePages}{" "}
              </span>

              <button
                disabled={routesPage === totalRoutePages}
                onClick={() => setRoutesPage(routesPage + 1)}
              >
                Наступна
              </button>
            </div>
          )}
        </>
      )}

      {detailsTab === "fuel" && (
        <>
          <h3>Заправки</h3>

          {periodFuelEntries.length === 0 && <p>Заправки не знайдено.</p>}

          {pagedFuelEntries.map((fuel) => (
            <div
              key={fuel.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "8px",
              }}
            >
              <p>
                <strong>Дата:</strong> {formatDate(fuel.date)}
              </p>

              <p>
                <strong>Показник одометра:</strong>{" "}
                {formatNumber(fuel.odometerReading)} км
              </p>

              <p>
                <strong>Літри:</strong> {formatNumber(fuel.liters)} л
              </p>

              <p>
                <strong>Повний бак:</strong> {fuel.isFullTank ? "Так" : "Ні"}
              </p>

              <p>
                <strong>Відстань з попередньої заправки:</strong>{" "}
                {formatNumber(fuel.distanceSinceLastRefuel)} км
              </p>

              <p>
                <strong>Витрата пального:</strong>{" "}
                {formatNumber(fuel.fuelConsumption)} л / 100 км
              </p>
            </div>
          ))}

          {totalFuelPages > 1 && (
            <div>
              <button
                disabled={fuelPage === 1}
                onClick={() => setFuelPage(fuelPage - 1)}
              >
                Попередня
              </button>

              <span>
                {" "}
                Сторінка {fuelPage} з {totalFuelPages}{" "}
              </span>

              <button
                disabled={fuelPage === totalFuelPages}
                onClick={() => setFuelPage(fuelPage + 1)}
              >
                Наступна
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VehicleDetailsPage;