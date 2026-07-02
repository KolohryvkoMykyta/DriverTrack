import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import {
  createFullRoute,
  getRouteEntries,
  type RouteEntry,
} from "../../api/routeEntriesApi";
import { getRouteTypes, type RouteType } from "../../api/routeTypesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

const ROUTES_PAGE_SIZE = 5;

function AdminRoutesTab() {
  const navigate = useNavigate();

  const [routeEntries, setRouteEntries] = useState<RouteEntry[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [selectedDriverId, setSelectedDriverId] = useState("all");
  const [selectedVehicleId, setSelectedVehicleId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newDriverId, setNewDriverId] = useState("");
  const [newVehicleId, setNewVehicleId] = useState("");
  const [newRouteTypeId, setNewRouteTypeId] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newStartOdometer, setNewStartOdometer] = useState("");
  const [newEndOdometer, setNewEndOdometer] = useState("");
  const [newTotalDistance, setNewTotalDistance] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");

  async function loadData() {
    const [routeEntries, drivers, vehicles, routeTypes] = await Promise.all([
      getRouteEntries(),
      getDrivers(),
      getVehicles(),
      getRouteTypes(),
    ]);

    setRouteEntries(routeEntries);
    setDrivers(drivers);
    setVehicles(vehicles);
    setRouteTypes(routeTypes);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await loadData();
      } catch (error) {
        console.error("Failed to load routes:", error);
        setErrorMessage("Не вдалося завантажити маршрути.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function updateTotalDistance(startValue: string, endValue: string) {
    const start = Number(startValue);
    const end = Number(endValue);

    if (!startValue || !endValue || end < start) {
      return;
    }

    setNewTotalDistance(String(end - start));
  }

  async function handleCreateRoute() {
    if (
      !newDriverId ||
      !newVehicleId ||
      !newRouteTypeId ||
      !newStartDate ||
      !newEndDate ||
      !newStartOdometer ||
      !newEndOdometer ||
      !newTotalDistance
    ) {
      setCreateErrorMessage("Заповніть усі поля маршруту.");
      return;
    }

    setCreateErrorMessage("");

    try {
      await createFullRoute({
        driverId: newDriverId,
        vehicleId: newVehicleId,
        routeTypeId: newRouteTypeId,
        startDate: newStartDate,
        startOdometer: Number(newStartOdometer),
        endDate: newEndDate,
        endOdometer: Number(newEndOdometer),
        totalDistance: Number(newTotalDistance),
      });

      setNewDriverId("");
      setNewVehicleId("");
      setNewRouteTypeId("");
      setNewStartDate("");
      setNewEndDate("");
      setNewStartOdometer("");
      setNewEndOdometer("");
      setNewTotalDistance("");

      setShowCreateForm(false);
      setCurrentPage(1);

      await loadData();
    } catch (error) {
      console.error("Failed to create route:", error);
      setCreateErrorMessage(getApiErrorMessage(error));
    }
  }

  const getDriverName = (driverId: string) => {
    const driver = drivers.find((driver) => driver.id === driverId);
    return driver?.name ?? "Невідомий водій";
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

    if (!vehicle) {
      return "Невідомий автомобіль";
    }

    return `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`;
  };

  const getRouteTypeName = (routeTypeId: string) => {
    const routeType = routeTypes.find(
      (routeType) => routeType.id === routeTypeId
    );

    return routeType?.name ?? "Невідомий тип маршруту";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "Не завершено";
    }

    return new Date(dateString).toLocaleString("uk-UA");
  };

  const filteredVehiclesForFilter =
    selectedDriverId === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.driverId === selectedDriverId);

  const filteredVehiclesForCreate = newDriverId
    ? vehicles.filter((vehicle) => vehicle.driverId === newDriverId)
    : vehicles;

  const filteredRouteEntries = routeEntries.filter((route) => {
    const matchesDriver =
      selectedDriverId === "all" || route.driverId === selectedDriverId;

    const matchesVehicle =
      selectedVehicleId === "all" || route.vehicleId === selectedVehicleId;

    return matchesDriver && matchesVehicle;
  });

  const sortedRouteEntries = [...filteredRouteEntries].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const totalPages = Math.ceil(sortedRouteEntries.length / ROUTES_PAGE_SIZE);

  const pagedRouteEntries = sortedRouteEntries.slice(
    (currentPage - 1) * ROUTES_PAGE_SIZE,
    currentPage * ROUTES_PAGE_SIZE
  );

  if (isLoading) {
    return <p>Завантаження маршрутів...</p>;
  }

  return (
    <div>
      <h2>Маршрути</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={() => setShowCreateForm(true)}>
        Додати маршрут
      </button>

      {showCreateForm && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <h3>Створення маршруту</h3>

          <p>Водій</p>
          <select
            value={newDriverId}
            onChange={(e) => {
              setNewDriverId(e.target.value);
              setNewVehicleId("");
              setCreateErrorMessage("");
            }}
          >
            <option value="">Оберіть водія</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <p>Автомобіль</p>
          <select
            value={newVehicleId}
            onChange={(e) => {
              setNewVehicleId(e.target.value);
              setCreateErrorMessage("");
            }}
          >
            <option value="">Оберіть автомобіль</option>
            {filteredVehiclesForCreate.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>

          <p>Тип маршруту</p>
          <select
            value={newRouteTypeId}
            onChange={(e) => {
              setNewRouteTypeId(e.target.value);
              setCreateErrorMessage("");
            }}
          >
            <option value="">Оберіть тип маршруту</option>
            {routeTypes.map((routeType) => (
              <option key={routeType.id} value={routeType.id}>
                {routeType.name}
              </option>
            ))}
          </select>

          <p>Дата початку</p>
          <input
            type="datetime-local"
            value={newStartDate}
            onChange={(e) => {
              setNewStartDate(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>Дата завершення</p>
          <input
            type="datetime-local"
            value={newEndDate}
            onChange={(e) => {
              setNewEndDate(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>Початковий одометр</p>
          <input
            type="number"
            value={newStartOdometer}
            onChange={(e) => {
              setNewStartOdometer(e.target.value);
              updateTotalDistance(e.target.value, newEndOdometer);
              setCreateErrorMessage("");
            }}
          />

          <p>Кінцевий одометр</p>
          <input
            type="number"
            value={newEndOdometer}
            onChange={(e) => {
              setNewEndOdometer(e.target.value);
              updateTotalDistance(newStartOdometer, e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>Загальна відстань</p>
          <input
            type="number"
            value={newTotalDistance}
            onChange={(e) => {
              setNewTotalDistance(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          {createErrorMessage && (
            <p style={{ color: "red", whiteSpace: "pre-line" }}>
              {createErrorMessage}
            </p>
          )}

          <br />

          <button onClick={handleCreateRoute}>Створити</button>

          <button
            onClick={() => {
              setShowCreateForm(false);
              setCreateErrorMessage("");
            }}
            style={{ marginLeft: "8px" }}
          >
            Скасувати
          </button>
        </div>
      )}

      <div style={{ marginBottom: "16px", marginTop: "16px" }}>
        <label>
          Фільтр за водієм:{" "}
          <select
            value={selectedDriverId}
            onChange={(e) => {
              setSelectedDriverId(e.target.value);
              setSelectedVehicleId("all");
              setCurrentPage(1);
            }}
          >
            <option value="all">Усі водії</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: "12px" }}>
          Фільтр за автомобілем:{" "}
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Усі автомобілі</option>
            {filteredVehiclesForFilter.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>
        </label>
      </div>

      {sortedRouteEntries.length === 0 && <p>Маршрути не знайдено.</p>}

      {pagedRouteEntries.map((route) => (
        <div
          key={route.id}
          onClick={() => navigate(`/admin/routes/${route.id}`)}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <p>
            <strong>{formatDate(route.startDate)}</strong>
          </p>

          <p>
            <strong>Водій:</strong> {getDriverName(route.driverId)}
          </p>

          <p>
            <strong>Автомобіль:</strong> {getVehicleName(route.vehicleId)}
          </p>

          <p>
            <strong>Тип маршруту:</strong>{" "}
            {getRouteTypeName(route.routeTypeId)}
          </p>

          <p>
            <strong>Відстань:</strong>{" "}
            {route.totalDistance ?? "не розраховано"} км
          </p>

          <p>
            <strong>Пальне:</strong>{" "}
            {route.fuelUsed ?? "не розраховано"} л
          </p>

          <p>
            <strong>Виручка:</strong> {route.revenue} ₴
          </p>

          <p>
            <strong>Оплата водію:</strong> {route.driverPayment} ₴
          </p>
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ marginTop: "16px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Назад
          </button>

          <span style={{ margin: "0 12px" }}>
            Сторінка {currentPage} з {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminRoutesTab;