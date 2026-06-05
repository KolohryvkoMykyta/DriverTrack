import { useEffect, useState } from "react";

import { getDrivers, type Driver } from "../../api/driversApi";
import { getVehicles, type Vehicle } from "../../api/vehiclesApi";
import {
  createFullRoute,
  getRouteEntries,
  type RouteEntry,
} from "../../api/routeEntriesApi";
import {
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";

const ROUTES_PAGE_SIZE = 5;

function AdminRoutesTab() {
  const [routeEntries, setRouteEntries] = useState<RouteEntry[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [selectedDriverId, setSelectedDriverId] = useState("all");
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

  async function loadData() {
    const [routeEntries, drivers, vehicles, routeTypes] =
      await Promise.all([
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
        setErrorMessage("Failed to load routes.");
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
      alert("Please fill all route fields.");
      return;
    }

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
      alert("Failed to create route.");
    }
  }

  const getDriverName = (driverId: string) => {
    const driver = drivers.find((driver) => driver.id === driverId);
    return driver?.name ?? "Unknown driver";
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

    if (!vehicle) {
      return "Unknown vehicle";
    }

    return `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`;
  };

  const getRouteTypeName = (routeTypeId: string) => {
    const routeType = routeTypes.find(
      (routeType) => routeType.id === routeTypeId
    );

    return routeType?.name ?? "Unknown route type";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "Not closed";
    }

    return new Date(dateString).toLocaleString();
  };

  const filteredRouteEntries =
    selectedDriverId === "all"
      ? routeEntries
      : routeEntries.filter(
          (route) => route.driverId === selectedDriverId
        );

  const sortedRouteEntries = [...filteredRouteEntries].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  );

  const totalPages = Math.ceil(
    sortedRouteEntries.length / ROUTES_PAGE_SIZE
  );

  const pagedRouteEntries = sortedRouteEntries.slice(
    (currentPage - 1) * ROUTES_PAGE_SIZE,
    currentPage * ROUTES_PAGE_SIZE
  );

  if (isLoading) {
    return <p>Loading routes...</p>;
  }

  return (
    <div>
      <h2>Routes</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={() => setShowCreateForm(true)}>Add Route</button>

      {showCreateForm && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <h3>Create route</h3>

          <p>Driver</p>
          <select
            value={newDriverId}
            onChange={(e) => setNewDriverId(e.target.value)}
          >
            <option value="">Select driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <p>Vehicle</p>
          <select
            value={newVehicleId}
            onChange={(e) => setNewVehicleId(e.target.value)}
          >
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>

          <p>Route type</p>
          <select
            value={newRouteTypeId}
            onChange={(e) => setNewRouteTypeId(e.target.value)}
          >
            <option value="">Select route type</option>
            {routeTypes.map((routeType) => (
              <option key={routeType.id} value={routeType.id}>
                {routeType.name}
              </option>
            ))}
          </select>

          <p>Start date</p>
          <input
            type="datetime-local"
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
          />

          <p>End date</p>
          <input
            type="datetime-local"
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
          />

          <p>Start odometer</p>
          <input
            type="number"
            value={newStartOdometer}
            onChange={(e) => {
              setNewStartOdometer(e.target.value);
              updateTotalDistance(e.target.value, newEndOdometer);
            }}
          />

          <p>End odometer</p>
          <input
            type="number"
            value={newEndOdometer}
            onChange={(e) => {
              setNewEndOdometer(e.target.value);
              updateTotalDistance(newStartOdometer, e.target.value);
            }}
          />

          <p>Total distance</p>
          <input
            type="number"
            value={newTotalDistance}
            onChange={(e) => setNewTotalDistance(e.target.value)}
          />

          <br />
          <br />

          <button onClick={handleCreateRoute}>Create</button>

          <button
            onClick={() => setShowCreateForm(false)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <div style={{ marginBottom: "16px", marginTop: "16px" }}>
        <label>
          Filter by driver:{" "}
          <select
            value={selectedDriverId}
            onChange={(e) => {
              setSelectedDriverId(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All drivers</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sortedRouteEntries.length === 0 && <p>No routes found.</p>}

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
            <strong>Driver:</strong> {getDriverName(route.driverId)}
          </p>
          <p>
            <strong>Vehicle:</strong> {getVehicleName(route.vehicleId)}
          </p>
          <p>
            <strong>Route type:</strong>{" "}
            {getRouteTypeName(route.routeTypeId)}
          </p>
          <p>
            <strong>Start date:</strong> {formatDate(route.startDate)}
          </p>
          <p>
            <strong>End date:</strong> {formatDate(route.endDate)}
          </p>
          <p>
            <strong>Start odometer:</strong> {route.startOdometer} km
          </p>
          <p>
            <strong>End odometer:</strong>{" "}
            {route.endOdometer ?? "Not closed"} km
          </p>
          <p>
            <strong>Total distance:</strong>{" "}
            {route.totalDistance ?? "Not calculated"} km
          </p>
          <p>
            <strong>Fuel used:</strong>{" "}
            {route.fuelUsed ?? "Not calculated"} l
          </p>
          <p>
            <strong>Earnings:</strong> {route.earnings} ₴
          </p>
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ marginTop: "16px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          <span style={{ margin: "0 12px" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminRoutesTab;