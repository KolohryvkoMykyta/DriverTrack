import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import { getApiErrorMessage } from "../../../api/apiErrorHandler";
import type { DriverListItem } from "../../../api/driversApi";
import { createFuelEntry } from "../../../api/fuelEntriesApi";
import type { Vehicle } from "../../../api/vehiclesApi";

type CreateFuelModalProps = {
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function CreateFuelModal({
  drivers,
  vehicles,
  onClose,
  onCreated,
}: CreateFuelModalProps) {
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [liters, setLiters] = useState("");
  const [isFullTank, setIsFullTank] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeDrivers = drivers.filter((driver) => driver.isActive);
  const availableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.isActive && (!driverId || vehicle.driverId === driverId)
  );

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    document.body.classList.add("fuel-modal-open");

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("fuel-modal-open");
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!driverId || !vehicleId || !date || !odometerReading || !liters) {
      setErrorMessage("Заповніть усі поля заправки.");
      return;
    }

    if (Number(odometerReading) < 0 || Number(liters) <= 0) {
      setErrorMessage("Перевірте показник одометра та кількість літрів.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await createFuelEntry({
        driverId,
        vehicleId,
        date,
        odometerReading: Number(odometerReading),
        liters: Number(liters),
        isFullTank,
      });

      await onCreated();
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fuel-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="fuel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-fuel-title"
      >
        <header className="fuel-modal__header">
          <div>
            <h2 id="create-fuel-title">Додати заправку</h2>
            <p>Заповніть дані нової заправки автомобіля.</p>
          </div>
          <button
            type="button"
            className="fuel-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="fuel-form">
            <div className="fuel-form__grid">
              <label className="fuel-form__field">
                <span>Водій</span>
                <select
                  autoFocus
                  value={driverId}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setDriverId(event.target.value);
                    setVehicleId("");
                    setErrorMessage("");
                  }}
                >
                  <option value="">Оберіть водія</option>
                  {activeDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="fuel-form__field">
                <span>Автомобіль</span>
                <select
                  value={vehicleId}
                  disabled={isSubmitting || !driverId}
                  onChange={(event) => {
                    setVehicleId(event.target.value);
                    setErrorMessage("");
                  }}
                >
                  <option value="">
                    {driverId
                      ? "Оберіть автомобіль"
                      : "Спочатку оберіть водія"}
                  </option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} — {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="fuel-form__field">
              <span>Дата і час</span>
              <input
                type="datetime-local"
                value={date}
                disabled={isSubmitting}
                onChange={(event) => {
                  setDate(event.target.value);
                  setErrorMessage("");
                }}
              />
            </label>

            <div className="fuel-form__grid">
              <label className="fuel-form__field">
                <span>Одометр, км</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={odometerReading}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setOdometerReading(event.target.value);
                    setErrorMessage("");
                  }}
                />
              </label>

              <label className="fuel-form__field">
                <span>Заправлено, л</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={liters}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setLiters(event.target.value);
                    setErrorMessage("");
                  }}
                />
              </label>
            </div>

            <label className="fuel-form__checkbox">
              <input
                type="checkbox"
                checked={isFullTank}
                disabled={isSubmitting}
                onChange={(event) => {
                  setIsFullTank(event.target.checked);
                  setErrorMessage("");
                }}
              />
              <span>
                <strong>Повний бак</strong>
                <small>Автомобіль заправлено до повного бака</small>
              </span>
            </label>

            {errorMessage && (
              <p className="fuel-form__error">{errorMessage}</p>
            )}
          </div>

          <footer className="fuel-modal__footer">
            <button
              type="button"
              className="fuel-button fuel-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="fuel-button fuel-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Додати заправку"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateFuelModal;
