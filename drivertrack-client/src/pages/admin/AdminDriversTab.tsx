import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerDriver } from "../../api/authApi";
import { getDrivers, type Driver } from "../../api/driversApi";

import DriverCard from "../../components/DriverCard";

function AdminDriversTab() {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<Driver[]>([]);

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
        const messages = Object.values(backendErrors).flat().join(" ");
        setErrorMessage(messages);
        return;
      }

      setErrorMessage(
        backendMessage ?? "Не вдалося створити водія."
      );
    }
  }

  function handleOpenDriverDetails(driver: Driver) {
    navigate(`/admin/drivers/${driver.id}`);
  }

  const activeDrivers = drivers.filter((driver) => driver.isActive);
  const inactiveDrivers = drivers.filter((driver) => !driver.isActive);

  if (isLoading) {
    return <p>Завантаження водіїв...</p>;
  }

  return (
    <div>
      <h2>Водії</h2>

      <div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Скасувати" : "Додати водія"}
        </button>

        <button onClick={() => setShowInactive(!showInactive)}>
          {showInactive
            ? "Приховати неактивних водіїв"
            : "Показати неактивних водіїв"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateDriver}>
          <h3>Створення водія</h3>

          <div>
            <label>Ім’я</label>
            <br />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label>Телефон</label>
            <br />
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
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
            <label>Пароль</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <button type="submit">Створити</button>
        </form>
      )}

      <h3>Активні водії</h3>

      {activeDrivers.length === 0 && <p>Активних водіїв не знайдено.</p>}

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
          <h3>Неактивні водії</h3>

          {inactiveDrivers.length === 0 && (
            <p>Неактивних водіїв не знайдено.</p>
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
    </div>
  );
}

export default AdminDriversTab;