import { useEffect, useState } from "react";

import { getDrivers, type Driver } from "../../api/driversApi";

import { getVehicles, createVehicle, type Vehicle, } from "../../api/vehiclesApi";

function AdminVehiclesTab() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  async function handleCreateVehicle() {
    try {
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

      const updatedVehicles = await getVehicles();
      setVehicles(updatedVehicles);

      setShowCreateForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create vehicle");
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [vehicles, drivers] = await Promise.all([
          getVehicles(),
          getDrivers(),
        ]);

        setVehicles(vehicles);
        setDrivers(drivers);
      } catch (error) {
        console.error("Failed to load vehicles:", error);
        setErrorMessage("Failed to load vehicles.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getDriverName = (driverId: string | null) => {
  if (driverId === null) {
    return "Not assigned";
  }

  const driver = drivers.find((driver) => driver.id === driverId);

  return driver?.name ?? "Unknown";
};

  if (isLoading) {
    return <p>Loading vehicles...</p>;
  }

  return (
    <div>
      <h2>Vehicles</h2>

      <button onClick={() => setShowCreateForm(true)}>
        Add Vehicle
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
        <h3>Create vehicle</h3>

        <p>Brand</p>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <p>Model</p>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <p>License plate</p>
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />

        <p>Driver</p>
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
        >
          <option value="">Not assigned</option>

          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button onClick={handleCreateVehicle}>
          Create
        </button>

        <button
          onClick={() => setShowCreateForm(false)}
          style={{ marginLeft: "8px" }}
        >
          Cancel
        </button>
      </div>
    )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {vehicles.length === 0 && <p>No vehicles found.</p>}

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

          <p>Driver: {getDriverName(vehicle.driverId)}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminVehiclesTab;