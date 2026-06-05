import { useEffect, useState } from "react";

import {
  getDrivers,
  type Driver,
} from "../../api/driversApi";

import {
  getVehiclesByDriverId,
  type Vehicle,
} from "../../api/vehiclesApi";

import {
  createFuelEntry,
  getFuelEntriesByDriverId,
  type FuelEntry,
} from "../../api/fuelEntriesApi";

function AdminFuelTab() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);

  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [liters, setLiters] = useState("");
  const [isFullTank, setIsFullTank] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    if (!selectedDriverId) {
      setVehicles([]);
      setFuelEntries([]);
      setVehicleId("");
      return;
    }

    loadDriverData(selectedDriverId);
  }, [selectedDriverId]);

  async function loadDrivers() {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch {
      setError("Failed to load drivers.");
    }
  }

  async function loadDriverData(driverId: string) {
    try {
      setError("");

      const [vehiclesData, fuelData] = await Promise.all([
        getVehiclesByDriverId(driverId),
        getFuelEntriesByDriverId(driverId),
      ]);

      setVehicles(vehiclesData);
      setFuelEntries(
        [...fuelData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      setVehicleId("");
    } catch {
      setError("Failed to load fuel data.");
    }
  }

  async function handleCreateFuelEntry(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedDriverId || !vehicleId || !date || !odometerReading || !liters) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setError("");

      await createFuelEntry({
        driverId: selectedDriverId,
        vehicleId,
        date,
        odometerReading: Number(odometerReading),
        liters: Number(liters),
        isFullTank,
      });

      setDate("");
      setOdometerReading("");
      setLiters("");
      setIsFullTank(true);

      await loadDriverData(selectedDriverId);
    } catch {
      setError("Failed to create fuel entry.");
    }
  }

  function getVehicleName(vehicleId: string) {
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!vehicle) {
      return vehicleId;
    }

    return `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`;
  }

  return (
    <div>
      <h2>Fuel entries</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <label>
          Driver:
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="">Select driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedDriverId && (
        <form onSubmit={handleCreateFuelEntry} style={{ marginBottom: "24px" }}>
          <h3>Add fuel entry</h3>

          <div>
            <label>
              Vehicle:
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                style={{ marginLeft: "8px" }}
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Date:
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Odometer:
              <input
                type="number"
                value={odometerReading}
                onChange={(e) => setOdometerReading(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Liters:
              <input
                type="number"
                step="0.01"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Full tank:
              <input
                type="checkbox"
                checked={isFullTank}
                onChange={(e) => setIsFullTank(e.target.checked)}
              />
            </label>
          </div>

          <button type="submit">Add fuel entry</button>
        </form>
      )}

      <h3>Fuel history</h3>

      {fuelEntries.length === 0 ? (
        <p>No fuel entries yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Odometer</th>
              <th>Liters</th>
              <th>Full tank</th>
              <th>Distance</th>
              <th>Consumption</th>
            </tr>
          </thead>

          <tbody>
            {fuelEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleString()}</td>
                <td>{getVehicleName(entry.vehicleId)}</td>
                <td>{entry.odometerReading}</td>
                <td>{entry.liters}</td>
                <td>{entry.isFullTank ? "Yes" : "No"}</td>
                <td>{entry.distanceSinceLastRefuel ?? "-"}</td>
                <td>
                  {entry.fuelConsumption
                    ? `${entry.fuelConsumption.toFixed(2)} L/100km`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminFuelTab;