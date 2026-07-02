import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import { getRouteTypes, type RouteType } from "../../api/routeTypesApi";
import {
  deleteRouteEntry,
  getRouteEntryById,
  updateRouteEntry,
  type RouteEntry,
} from "../../api/routeEntriesApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

function RouteDetailsPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState<RouteEntry | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [routeTypeId, setRouteTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startOdometer, setStartOdometer] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [driverPayment, setDriverPayment] = useState("");
  const [revenue, setRevenue] = useState("");

  async function loadData() {
    if (!routeId) return;

    const [routeData, driversData, vehiclesData, routeTypesData] =
      await Promise.all([
        getRouteEntryById(routeId),
        getDrivers(),
        getVehicles(),
        getRouteTypes(),
      ]);

    setRoute(routeData);
    setDrivers(driversData);
    setVehicles(vehiclesData);
    setRouteTypes(routeTypesData);

    setVehicleId(routeData.vehicleId);
    setRouteTypeId(routeData.routeTypeId);
    setStartDate(routeData.startDate.slice(0, 16));
    setEndDate(routeData.endDate ? routeData.endDate.slice(0, 16) : "");
    setStartOdometer(String(routeData.startOdometer));
    setEndOdometer(String(routeData.endOdometer ?? ""));
    setTotalDistance(String(routeData.totalDistance ?? ""));
    setDriverPayment(String(routeData.driverPayment));
    setRevenue(String(routeData.revenue));
  }

  useEffect(() => {
    loadData().catch((error) => {
      console.error(error);
      setErrorMessage("Не вдалося завантажити маршрут.");
    });
  }, [routeId]);

  function getDriverName(driverId: string) {
    return drivers.find((driver) => driver.id === driverId)?.name ?? "Невідомий водій";
  }

  function getVehicleName(id: string) {
    const vehicle = vehicles.find((vehicle) => vehicle.id === id);
    return vehicle
      ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`
      : "Невідомий автомобіль";
  }

  function getRouteTypeName(id: string) {
    return routeTypes.find((routeType) => routeType.id === id)?.name ?? "Невідомий тип";
  }

  function formatDate(value: string | null) {
    if (!value) return "Не завершено";
    return new Date(value).toLocaleString("uk-UA");
  }

  async function handleSave() {
    if (!routeId || !route) return;

    try {
      setErrorMessage("");

      await updateRouteEntry(routeId, {
        vehicleId,
        routeTypeId,
        startDate,
        startOdometer: Number(startOdometer),
        endDate,
        endOdometer: Number(endOdometer),
        totalDistance: Number(totalDistance),
        driverPayment: Number(driverPayment),
        revenue: Number(revenue),
      });

      setIsEditing(false);
      await loadData();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!routeId) return;

    const confirmed = window.confirm("Видалити цей маршрут?");
    if (!confirmed) return;

    try {
      await deleteRouteEntry(routeId);
      navigate(-1);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  if (!route) {
    return <p>Завантаження маршруту...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Назад</button>

      <h2>Деталі маршруту</h2>

      {errorMessage && (
        <p style={{ color: "red", whiteSpace: "pre-line" }}>
          {errorMessage}
        </p>
      )}

      {!isEditing ? (
        <>
          <p><strong>ID:</strong> {route.id}</p>
          <p><strong>Водій:</strong> {getDriverName(route.driverId)}</p>
          <p><strong>Автомобіль:</strong> {getVehicleName(route.vehicleId)}</p>
          <p><strong>Тип маршруту:</strong> {getRouteTypeName(route.routeTypeId)}</p>
          <p><strong>Період:</strong> {formatDate(route.startDate)} — {formatDate(route.endDate)}</p>
          <p><strong>Одометр:</strong> {route.startOdometer} км — {route.endOdometer} км</p>
          <p><strong>Відстань:</strong> {route.totalDistance} км</p>
          <p><strong>Пальне:</strong> {route.fuelUsed ?? "не розраховано"} л</p>
          <p><strong>Виручка:</strong> {route.revenue} ₴</p>
          <p><strong>Оплата водію:</strong> {route.driverPayment} ₴</p>

          <button onClick={() => setIsEditing(true)}>Редагувати</button>
          <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
            Видалити
          </button>
        </>
      ) : (
        <>
          <p>Автомобіль</p>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>

          <p>Тип маршруту</p>
          <select value={routeTypeId} onChange={(e) => setRouteTypeId(e.target.value)}>
            {routeTypes.map((routeType) => (
              <option key={routeType.id} value={routeType.id}>
                {routeType.name}
              </option>
            ))}
          </select>

          <p>Дата початку</p>
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <p>Дата завершення</p>
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <p>Початковий одометр</p>
          <input type="number" value={startOdometer} onChange={(e) => setStartOdometer(e.target.value)} />

          <p>Кінцевий одометр</p>
          <input type="number" value={endOdometer} onChange={(e) => setEndOdometer(e.target.value)} />

          <p>Загальна відстань</p>
          <input type="number" value={totalDistance} onChange={(e) => setTotalDistance(e.target.value)} />

          <p>Виручка</p>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} />

          <p>Оплата водію</p>
          <input type="number" value={driverPayment} onChange={(e) => setDriverPayment(e.target.value)} />

          <br />
          <br />

          <button onClick={handleSave}>Зберегти</button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: "8px" }}>
            Скасувати
          </button>
        </>
      )}
    </div>
  );
}

export default RouteDetailsPage;