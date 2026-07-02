import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import {
  getVehicles,
  createVehicle,
  type Vehicle,
} from "../../api/vehiclesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

function AdminVehiclesTab() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  async function loadVehicles() {
    const vehicles = await getVehicles();
    setVehicles(vehicles);
  }

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [vehiclesData, driversData] = await Promise.all([
          getVehicles(),
          getDrivers(),
        ]);

        setVehicles(vehiclesData);
        setDrivers(driversData);
      } catch (error) {
        console.error("Failed to load vehicles:", error);
        setErrorMessage("Не вдалося завантажити автомобілі.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleCreateVehicle() {
    try {
      setErrorMessage("");

      await createVehicle({
        brand,
        model,
        licensePlate,
        driverId: selectedDriverId || null,
      });

      setBrand("");
      setModel("");
      setLicensePlate("");
      setSelectedDriverId("");
      setShowCreateForm(false);

      await loadVehicles();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  function handleOpenVehicleDetails(vehicle: Vehicle) {
    navigate(`/admin/vehicles/${vehicle.id}`);
  }

  function getDriverName(driverId: string | null) {
    if (driverId === null) {
      return "Не призначено";
    }

    const driver = drivers.find((driver) => driver.id === driverId);

    return driver?.name ?? "Невідомий водій";
  }

  function getStatusText(isActive: boolean) {
    return isActive ? "Активний" : "Неактивний";
  }

  function getAverageFuelConsumptionText(value: number | null) {
    if (value === null || value === undefined) {
      return "Немає даних";
    }

    return `${value} л / 100 км`;
  }

  const activeVehicles = vehicles.filter((vehicle) => vehicle.isActive);
  const inactiveVehicles = vehicles.filter((vehicle) => !vehicle.isActive);

  if (isLoading) {
    return <p>Завантаження автомобілів...</p>;
  }

  return (
    <div>
      <h2>Автомобілі</h2>

      <div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Скасувати" : "Додати автомобіль"}
        </button>

        <button onClick={() => setShowInactive(!showInactive)}>
          {showInactive
            ? "Приховати неактивні автомобілі"
            : "Показати неактивні автомобілі"}
        </button>
      </div>

      {showCreateForm && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <h3>Створення автомобіля</h3>

          <p>Марка</p>
          <input
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          />

          <p>Модель</p>
          <input
            type="text"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />

          <p>Державний номер</p>
          <input
            type="text"
            value={licensePlate}
            onChange={(event) => setLicensePlate(event.target.value)}
          />

          <p>Водій</p>
          <select
            value={selectedDriverId}
            onChange={(event) => setSelectedDriverId(event.target.value)}
          >
            <option value="">Не призначено</option>

            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <button onClick={handleCreateVehicle}>Створити</button>

          <button
            onClick={() => setShowCreateForm(false)}
            style={{ marginLeft: "8px" }}
          >
            Скасувати
          </button>
        </div>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h3>Активні автомобілі</h3>

      {activeVehicles.length === 0 && <p>Активних автомобілів не знайдено.</p>}

      {activeVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          onClick={() => handleOpenVehicleDetails(vehicle)}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <strong>
            {vehicle.brand} {vehicle.model}
          </strong>

          <p>Номер: {vehicle.licensePlate}</p>

          <p>Статус: {getStatusText(vehicle.isActive)}</p>

          <p>
            Середня витрата пального:{" "}
            {getAverageFuelConsumptionText(vehicle.averageFuelConsumption)}
          </p>

          <p>Водій: {getDriverName(vehicle.driverId)}</p>
        </div>
      ))}

      {showInactive && (
        <>
          <h3>Неактивні автомобілі</h3>

          {inactiveVehicles.length === 0 && (
            <p>Неактивних автомобілів не знайдено.</p>
          )}

          {inactiveVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleOpenVehicleDetails(vehicle)}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
            >
              <strong>
                {vehicle.brand} {vehicle.model}
              </strong>

              <p>Номер: {vehicle.licensePlate}</p>

              <p>Статус: {getStatusText(vehicle.isActive)}</p>

              <p>
                Середня витрата пального:{" "}
                {getAverageFuelConsumptionText(vehicle.averageFuelConsumption)}
              </p>

              <p>Водій: {getDriverName(vehicle.driverId)}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default AdminVehiclesTab;