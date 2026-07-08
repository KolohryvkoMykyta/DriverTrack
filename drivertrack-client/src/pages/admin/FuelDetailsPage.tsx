import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import {
  deleteFuelEntry,
  getFuelEntryById,
  updateFuelEntry,
  type FuelEntry,
} from "../../api/fuelEntriesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

function FuelDetailsPage() {
  const { fuelEntryId } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState<FuelEntry | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [date, setDate] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [liters, setLiters] = useState("");
  const [isFullTank, setIsFullTank] = useState(true);

  async function loadData() {
    if (!fuelEntryId) return;

    const [entryData, driversData, vehiclesData] = await Promise.all([
      getFuelEntryById(fuelEntryId),
      getDrivers(),
      getVehicles(),
    ]);

    setEntry(entryData);
    setDrivers(driversData);
    setVehicles(vehiclesData);

    setDate(entryData.date.slice(0, 16));
    setOdometerReading(String(entryData.odometerReading));
    setLiters(String(entryData.liters));
    setIsFullTank(entryData.isFullTank);
  }

  useEffect(() => {
    loadData().catch((error) => {
      console.error(error);
      setErrorMessage("Не вдалося завантажити заправку.");
    });
  }, [fuelEntryId]);

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

  function formatDate(value: string) {
    return new Date(value).toLocaleString("uk-UA");
  }

  async function handleSave() {
    if (!fuelEntryId) return;

    try {
      setErrorMessage("");

      await updateFuelEntry(fuelEntryId, {
        date,
        odometerReading: Number(odometerReading),
        liters: Number(liters),
        isFullTank,
      });

      setIsEditing(false);
      await loadData();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!fuelEntryId) return;

    const confirmed = window.confirm("Видалити цю заправку?");
    if (!confirmed) return;

    try {
      await deleteFuelEntry(fuelEntryId);
      navigate(-1);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  if (!entry) {
    return <p>Завантаження заправки...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Назад</button>

      <h2>Деталі заправки</h2>

      {errorMessage && (
        <p style={{ color: "red", whiteSpace: "pre-line" }}>
          {errorMessage}
        </p>
      )}

      {!isEditing ? (
        <>
          <p>
            <strong>ID:</strong> {entry.id}
          </p>

          <p>
            <strong>Водій:</strong> {getDriverName(entry.driverId)}
          </p>

          <p>
            <strong>Автомобіль:</strong> {getVehicleName(entry.vehicleId)}
          </p>

          <p>
            <strong>Дата:</strong> {formatDate(entry.date)}
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

          <button onClick={() => setIsEditing(true)}>Редагувати</button>

          <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
            Видалити
          </button>
        </>
      ) : (
        <>
          <p>Дата</p>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <p>Одометр</p>
          <input
            type="number"
            value={odometerReading}
            onChange={(e) => setOdometerReading(e.target.value)}
          />

          <p>Літри</p>
          <input
            type="number"
            step="0.01"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
          />

          <p>
            <label>
              Повний бак:{" "}
              <input
                type="checkbox"
                checked={isFullTank}
                onChange={(e) => setIsFullTank(e.target.checked)}
              />
            </label>
          </p>

          <button onClick={handleSave}>Зберегти</button>

          <button
            onClick={() => setIsEditing(false)}
            style={{ marginLeft: "8px" }}
          >
            Скасувати
          </button>
        </>
      )}
    </div>
  );
}

export default FuelDetailsPage;