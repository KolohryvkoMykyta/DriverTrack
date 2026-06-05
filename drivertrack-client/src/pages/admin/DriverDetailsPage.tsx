import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getDriverById, type Driver } from "../../api/driversApi";
import {
  getVehiclesByDriverId,
  type Vehicle,
} from "../../api/vehiclesApi";
import {
  getRouteEntriesByDriverId,
  type RouteEntry,
} from "../../api/routeEntriesApi";

const ROUTES_PAGE_SIZE = 5;

function DriverDetailsPage() {
  const { driverId } = useParams();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeEntries, setRouteEntries] = useState<RouteEntry[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<string>("all");
  const [routesPage, setRoutesPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDriverDetails() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (!driverId) {
          setErrorMessage("Driver id is missing.");
          return;
        }

        const driver = await getDriverById(driverId);
        const vehicles = await getVehiclesByDriverId(driverId);
        const routeEntries = await getRouteEntriesByDriverId(driverId);

        setDriver(driver);
        setVehicles(vehicles);
        setRouteEntries(routeEntries);
        setSelectedVehicleId("all");
        setRoutesPage(1);
      } catch (error) {
        console.error("Failed to load driver details:", error);
        setErrorMessage("Failed to load driver details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDriverDetails();
  }, [driverId]);

  if (isLoading) {
    return <p>Loading driver details...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <Link to="/admin">← Back to admin</Link>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div>
        <Link to="/admin">← Back to admin</Link>
        <p>Driver not found.</p>
      </div>
    );
  }

  const filteredRouteEntries =
    selectedVehicleId === "all"
      ? routeEntries
      : routeEntries.filter(
          (route) => route.vehicleId === selectedVehicleId
        );

  const sortedRouteEntries = [...filteredRouteEntries].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  );

  const totalRoutePages = Math.ceil(
    sortedRouteEntries.length / ROUTES_PAGE_SIZE
  );

  const pagedRouteEntries = sortedRouteEntries.slice(
    (routesPage - 1) * ROUTES_PAGE_SIZE,
    routesPage * ROUTES_PAGE_SIZE
  );

  return (
    <div>
      <Link to="/admin">← Back to admin</Link>

      <h2>Driver details</h2>

      <div>
        <p>
          <strong>Id:</strong> {driver.id}
        </p>

        <p>
          <strong>Name:</strong> {driver.name}
        </p>

        <p>
          <strong>Phone:</strong> {driver.phoneNumber}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {driver.isActive ? "Active" : "Inactive"}
        </p>
      </div>

      <hr />

      <h3>Assigned vehicles</h3>

      {vehicles.length === 0 && (
        <p>No vehicles assigned to this driver.</p>
      )}

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "8px",
          }}
        >
          <strong>
            {vehicle.brand} {vehicle.model}
          </strong>

          <p>License plate: {vehicle.licensePlate}</p>

          <p>Status: {vehicle.isActive ? "Active" : "Inactive"}</p>

          <p>
            Average fuel consumption:{" "}
            {vehicle.averageFuelConsumption}
          </p>
        </div>
      ))}

      <div style={{ marginBottom: "16px" }}>
        <h4>Filter routes by vehicle</h4>

        <button
          type="button"
          onClick={() => {
            setSelectedVehicleId("all");
            setRoutesPage(1);
          }}
        >
          All vehicles
        </button>

        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => {
              setSelectedVehicleId(vehicle.id);
              setRoutesPage(1);
            }}
            style={{ marginLeft: "8px" }}
          >
            {vehicle.brand} {vehicle.model}
          </button>
        ))}
      </div>

      <hr />

      <h3>Routes</h3>

      {filteredRouteEntries.length === 0 && <p>No routes found.</p>}

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
            <strong>Start date:</strong> {route.startDate}
          </p>

          <p>
            <strong>End date:</strong>{" "}
            {route.endDate ?? "Not closed"}
          </p>

          <p>
            <strong>Total distance:</strong>{" "}
            {route.totalDistance}
          </p>

          <p>
            <strong>Fuel used:</strong> {route.fuelUsed}
          </p>

          <p>
            <strong>Earnings:</strong> {route.earnings}
          </p>
        </div>
      ))}

      {totalRoutePages > 1 && (
        <div>
          <button
            disabled={routesPage === 1}
            onClick={() => setRoutesPage(routesPage - 1)}
          >
            Previous
          </button>

          <span>
            {" "}
            Page {routesPage} of {totalRoutePages}{" "}
          </span>

          <button
            disabled={routesPage === totalRoutePages}
            onClick={() => setRoutesPage(routesPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DriverDetailsPage;