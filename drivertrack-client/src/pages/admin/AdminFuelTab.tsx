import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import {
  createFuelEntry,
  getFuelEntries,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

function AdminFuelTab() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);

  const [selectedDriverId, setSelectedDriverId] = useState("all");
  const [selectedVehicleId, setSelectedVehicleId] = useState("all");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newDriverId, setNewDriverId] = useState("");
  const [newVehicleId, setNewVehicleId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newOdometerReading, setNewOdometerReading] = useState("");
  const [newLiters, setNewLiters] = useState("");
  const [newIsFullTank, setNewIsFullTank] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const navigate = useNavigate();

  async function loadData() {
    const [driversData, vehiclesData, fuelEntriesData] = await Promise.all([
      getDrivers(),
      getVehicles(),
      getFuelEntries(),
    ]);

    setDrivers(driversData);
    setVehicles(vehiclesData);
    setFuelEntries(fuelEntriesData);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await loadData();
      } catch (error) {
        console.error("Failed to load fuel data:", error);
        setErrorMessage("Не вдалося завантажити заправки.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function handleCreateFuelEntry() {
    if (
      !newDriverId ||
      !newVehicleId ||
      !newDate ||
      !newOdometerReading ||
      !newLiters
    ) {
      setCreateErrorMessage("Заповніть усі поля заправки.");
      return;
    }

    try {
      setCreateErrorMessage("");

      await createFuelEntry({
        driverId: newDriverId,
        vehicleId: newVehicleId,
        date: newDate,
        odometerReading: Number(newOdometerReading),
        liters: Number(newLiters),
        isFullTank: newIsFullTank,
      });

      setNewDriverId("");
      setNewVehicleId("");
      setNewDate("");
      setNewOdometerReading("");
      setNewLiters("");
      setNewIsFullTank(true);

      setShowCreateForm(false);

      await loadData();
    } catch (error) {
      console.error("Failed to create fuel entry:", error);
      setCreateErrorMessage(getApiErrorMessage(error));
    }
  }

  function getDriverName(driverId: string) {
    return drivers.find((driver) => driver.id === driverId)?.name ?? "Невідомий водій";
  }

  function getVehicleName(vehicleId: string) {
    const vehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

    if (!vehicle) {
      return "Невідомий автомобіль";
    }

    return `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("uk-UA");
  }

  const vehiclesForFilter =
    selectedDriverId === "all"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.driverId === selectedDriverId);

  const vehiclesForCreate = newDriverId
    ? vehicles.filter((vehicle) => vehicle.driverId === newDriverId)
    : vehicles;

  const filteredFuelEntries = fuelEntries.filter((entry) => {
    const matchesDriver =
      selectedDriverId === "all" || entry.driverId === selectedDriverId;

    const matchesVehicle =
      selectedVehicleId === "all" || entry.vehicleId === selectedVehicleId;

    return matchesDriver && matchesVehicle;
  });

  const sortedFuelEntries = [...filteredFuelEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (isLoading) {
    return <p>Завантаження заправок...</p>;
  }

  return (
    <div>
      <h2>Заправки</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={() => setShowCreateForm(true)}>
        Додати заправку
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
          <h3>Створення заправки</h3>

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
            {vehiclesForCreate.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>

          <p>Дата</p>
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => {
              setNewDate(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>Одометр</p>
          <input
            type="number"
            value={newOdometerReading}
            onChange={(e) => {
              setNewOdometerReading(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>Літри</p>
          <input
            type="number"
            step="0.01"
            value={newLiters}
            onChange={(e) => {
              setNewLiters(e.target.value);
              setCreateErrorMessage("");
            }}
          />

          <p>
            <label>
              Повний бак:{" "}
              <input
                type="checkbox"
                checked={newIsFullTank}
                onChange={(e) => {
                  setNewIsFullTank(e.target.checked);
                  setCreateErrorMessage("");
                }}
              />
            </label>
          </p>

          {createErrorMessage && (
            <p style={{ color: "red", whiteSpace: "pre-line" }}>
              {createErrorMessage}
            </p>
          )}

          <button onClick={handleCreateFuelEntry}>Створити</button>

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
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            <option value="all">Усі автомобілі</option>
            {vehiclesForFilter.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Історія заправок</h3>

      {sortedFuelEntries.length === 0 ? (
        <p>Заправки не знайдено.</p>
      ) : (
        sortedFuelEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => navigate(`/admin/fuel/${entry.id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "8px",
            }}
          >
            <p>
              <strong>{formatDate(entry.date)}</strong>
            </p>

            <p>
              <strong>Водій:</strong> {getDriverName(entry.driverId)}
            </p>

            <p>
              <strong>Автомобіль:</strong> {getVehicleName(entry.vehicleId)}
            </p>

            <p>
              <strong>Одометр:</strong> {entry.odometerReading} км
            </p>

            <p>
              <strong>Літри:</strong> {entry.liters} л
            </p>

            <p>
              <strong>Повний бак:</strong> {entry.isFullTank ? "Так" : "Ні"}
            </p>

            <p>
              <strong>Пробіг від попередньої заправки:</strong>{" "}
              {entry.distanceSinceLastRefuel ?? "не розраховано"} км
            </p>

            <p>
              <strong>Витрата:</strong>{" "}
              {entry.fuelConsumption
                ? `${entry.fuelConsumption.toFixed(2)} л / 100 км`
                : "не розраховано"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminFuelTab;