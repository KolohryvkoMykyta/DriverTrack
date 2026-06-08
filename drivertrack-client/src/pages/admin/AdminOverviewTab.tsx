import { useEffect, useState } from "react";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import {
  getAdminOverview,
  type AdminOverviewDto,
} from "../../api/statisticsApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

type PeriodMode = "week" | "month" | "all" | "custom";
type DetailsTab = "drivers" | "vehicles";

function AdminOverviewTab() {
  const [overview, setOverview] = useState<AdminOverviewDto | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [detailsTab, setDetailsTab] = useState<DetailsTab>("drivers");

  const [periodMode, setPeriodMode] = useState<PeriodMode>("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function loadOverview(mode: PeriodMode = periodMode) {
    try {
      setIsLoading(true);
      setError("");

      const periodDates = getPeriodDates(mode);

      const data = await getAdminOverview({
        from: periodDates.from,
        to: periodDates.to,
        driverId: driverId || undefined,
        vehicleId: vehicleId || undefined,
      });

      setOverview(data);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function changePeriodMode(mode: PeriodMode) {
    setPeriodMode(mode);

    if (mode !== "custom") {
      await loadOverview(mode);
    }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true);
        setError("");

        const [driversData, vehiclesData, overviewData] = await Promise.all([
          getDrivers(),
          getVehicles(),
          getAdminOverview(getPeriodDates("month")),
        ]);

        setDrivers(driversData);
        setVehicles(vehiclesData);
        setOverview(overviewData);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, []);

  function resetFilters() {
    setPeriodMode("month");
    setFrom("");
    setTo("");
    setDriverId("");
    setVehicleId("");

    loadOverview("month");
  }

  function formatMoney(value: number) {
    return `${value.toFixed(2)} грн`;
  }

  function formatNumber(value: number) {
    return value.toFixed(2);
  }

  function getPeriodButtonStyle(mode: PeriodMode) {
    return {
      fontWeight: periodMode === mode ? "bold" : "normal",
    };
  }

  if (isLoading && !overview) {
    return <p>Завантаження огляду...</p>;
  }

  return (
    <div>
      <h2>Огляд</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
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
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div>
              <label>По дату</label>
              <br />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        )}

        <h3>Фільтри</h3>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <label>Водій</label>
            <br />
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">Усі водії</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Автомобіль</label>
            <br />
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Усі автомобілі</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} — {vehicle.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div style={{ alignSelf: "end" }}>
            <button onClick={() => loadOverview()}>Застосувати</button>
            <button onClick={resetFilters}>Скинути</button>
          </div>
        </div>
      </div>

      <hr />

      {overview && (
        <>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <h3>Дохід компанії</h3>
              <p>{formatMoney(overview.totalRevenue)}</p>
            </div>

            <div>
              <h3>Зарплата водіям</h3>
              <p>{formatMoney(overview.totalDriverPayment)}</p>
            </div>

            <div>
              <h3>Витрати на паливо</h3>
              <p>{formatMoney(overview.totalFuelCost)}</p>
            </div>

            <div>
              <h3>Чистий прибуток</h3>
              <p>{formatMoney(overview.netProfit)}</p>
            </div>

            <div>
              <h3>Маршрути</h3>
              <p>{overview.routeCount}</p>
            </div>

            <div>
              <h3>Пробіг</h3>
              <p>{formatNumber(overview.totalDistance)} км</p>
            </div>

            <div>
              <h3>Паливо</h3>
              <p>{formatNumber(overview.totalFuelLiters)} л</p>
            </div>

            <div>
              <h3>Середня витрата</h3>
              <p>
                {overview.averageFuelConsumption === null
                  ? "Немає даних"
                  : `${overview.averageFuelConsumption} л / 100 км`}
              </p>
            </div>

            <div>
              <h3>Поточна ціна палива</h3>
              <p>
                {overview.currentFuelPrice === null
                  ? "Не задана"
                  : `${overview.currentFuelPrice.pricePerLiter} грн/л`}
              </p>
            </div>
          </div>

          <hr />

          <h3>Деталізація</h3>

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <button
              style={{
                fontWeight: detailsTab === "drivers" ? "bold" : "normal",
              }}
              onClick={() => setDetailsTab("drivers")}
            >
              Водії
            </button>

            <button
              style={{
                fontWeight: detailsTab === "vehicles" ? "bold" : "normal",
              }}
              onClick={() => setDetailsTab("vehicles")}
            >
              Автомобілі
            </button>
          </div>

          {detailsTab === "drivers" && (
            <>
              {overview.drivers.length === 0 ? (
                <p>Немає даних по водіях.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Водій</th>
                      <th>Маршрути</th>
                      <th>Дохід</th>
                      <th>Зарплата</th>
                      <th>Паливо</th>
                      <th>Прибуток</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.drivers.map((driver) => (
                      <tr key={driver.driverId}>
                        <td>{driver.driverName}</td>
                        <td>{driver.routeCount}</td>
                        <td>{formatMoney(driver.revenue)}</td>
                        <td>{formatMoney(driver.driverPayment)}</td>
                        <td>{formatMoney(driver.fuelCost)}</td>
                        <td>{formatMoney(driver.netProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {detailsTab === "vehicles" && (
            <>
              {overview.vehicles.length === 0 ? (
                <p>Немає даних по автомобілях.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Автомобіль</th>
                      <th>Номер</th>
                      <th>Маршрути</th>
                      <th>Пробіг</th>
                      <th>Паливо</th>
                      <th>Середня витрата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.vehicles.map((vehicle) => (
                      <tr key={vehicle.vehicleId}>
                        <td>{vehicle.vehicleName}</td>
                        <td>{vehicle.licensePlate}</td>
                        <td>{vehicle.routeCount}</td>
                        <td>{formatNumber(vehicle.totalDistance)} км</td>
                        <td>{formatNumber(vehicle.totalFuelLiters)} л</td>
                        <td>
                          {vehicle.averageFuelConsumption === null
                            ? "Немає даних"
                            : `${vehicle.averageFuelConsumption} л / 100 км`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminOverviewTab;