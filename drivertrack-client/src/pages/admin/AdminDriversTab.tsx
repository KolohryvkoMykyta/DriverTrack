import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerDriver } from "../../api/authApi";
import { getDrivers, type Driver } from "../../api/driversApi";

import DriverCard from "../../components/DriverCard";

function AdminDriversTab() {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [showInactive, setShowInactive] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  async function loadDrivers() {
    const drivers = await getDrivers();
    setDrivers(drivers);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        await loadDrivers();
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function handleCreateDriver(event: React.FormEvent) {
    event.preventDefault();

    try {
      setErrorMessage("");

      await registerDriver({
        name,
        phoneNumber,
        email,
        password,
      });

      setName("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");

      setShowCreateForm(false);

      await loadDrivers();
    } catch (error: any) {
      const backendMessage = error.response?.data?.Message;
      const backendErrors = error.response?.data?.Errors;

      if (backendErrors) {
        const messages = Object.values(backendErrors)
          .flat()
          .join(" ");

        setErrorMessage(messages);

        return;
      }

      setErrorMessage(
        backendMessage ?? "Unexpected error while creating driver."
      );
    }
  }

  function handleOpenDriverDetails(driver: Driver) {
    navigate(`/admin/drivers/${driver.id}`);
  }

  const activeDrivers = drivers.filter((driver) => driver.isActive);

  const inactiveDrivers = drivers.filter(
    (driver) => !driver.isActive
  );

  if (isLoading) {
    return <p>Loading drivers...</p>;
  }

  return (
    <div>
      <h2>Drivers</h2>

      <div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Add driver"}
        </button>

        <button onClick={() => setShowInactive(!showInactive)}>
          {showInactive
            ? "Hide inactive drivers"
            : "Show inactive drivers"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateDriver}>
          <h3>Create driver</h3>

          <div>
            <label>Name</label>
            <br />

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label>Phone number</label>
            <br />

            <input
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
            />
          </div>

          <div>
            <label>Email</label>
            <br />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label>Password</label>
            <br />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {errorMessage && (
            <p style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}

          <button type="submit">Create</button>
        </form>
      )}

      <h3>Active drivers</h3>

      {activeDrivers.length === 0 && (
        <p>No active drivers found.</p>
      )}

      <div>
        {activeDrivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onClick={handleOpenDriverDetails}
          />
        ))}
      </div>

      {showInactive && (
        <>
          <h3>Inactive drivers</h3>

          {inactiveDrivers.length === 0 && (
            <p>No inactive drivers found.</p>
          )}

          <div>
            {inactiveDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onClick={handleOpenDriverDetails}
              />
            ))}
          </div>
        </>
      )}

      {selectedDriver && (
        <div>
          <hr />

          <h3>Selected driver</h3>

          <p>Id: {selectedDriver.id}</p>

          <p>Name: {selectedDriver.name}</p>

          <p>Phone: {selectedDriver.phoneNumber}</p>

          <p>
            Status:{" "}
            {selectedDriver.isActive
              ? "Active"
              : "Inactive"}
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDriversTab;