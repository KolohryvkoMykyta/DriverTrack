import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import {
  getApiErrorMessage,
} from "../../../api/apiErrorHandler";

import {
  updateRouteEntry,
  type RouteDetails,
} from "../../../api/routeEntriesApi";

import type { RouteType } from "../../../api/routeTypesApi";
import type { Vehicle } from "../../../api/vehiclesApi";

type EditRouteModalProps = {
  route: RouteDetails;
  vehicles: Vehicle[];
  routeTypes: RouteType[];
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

function toDateTimeInput(value: string | null) {
  return value ? value.slice(0, 16) : "";
}

function EditRouteModal({
  route,
  vehicles,
  routeTypes,
  onClose,
  onUpdated,
}: EditRouteModalProps) {
  const [vehicleId, setVehicleId] = useState(route.vehicleId);
  const [routeTypeId, setRouteTypeId] = useState(route.routeTypeId);
  const [startDate, setStartDate] = useState(
    toDateTimeInput(route.startDate)
  );
  const [endDate, setEndDate] = useState(
    toDateTimeInput(route.endDate)
  );
  const [startOdometer, setStartOdometer] = useState(
    String(route.startOdometer)
  );
  const [endOdometer, setEndOdometer] = useState(
    route.endOdometer === null ? "" : String(route.endOdometer)
  );
  const [driverPayment, setDriverPayment] = useState(
    String(route.driverPayment)
  );
  const [revenue, setRevenue] = useState(String(route.revenue));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.body.classList.add("route-details-modal-open");
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("route-details-modal-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const parsedStartOdometer = Number(startOdometer);
    const parsedEndOdometer = endOdometer
      ? Number(endOdometer)
      : null;
    const parsedDriverPayment = Number(driverPayment);
    const parsedRevenue = Number(revenue);

    if (!vehicleId || !routeTypeId || !startDate) {
      setErrorMessage("Заповніть обов’язкові поля.");
      return;
    }

    if (
      !Number.isFinite(parsedStartOdometer) ||
      parsedStartOdometer < 0 ||
      !Number.isFinite(parsedDriverPayment) ||
      parsedDriverPayment < 0 ||
      !Number.isFinite(parsedRevenue) ||
      parsedRevenue < 0
    ) {
      setErrorMessage("Перевірте числові значення маршруту.");
      return;
    }

    if (Boolean(endDate) !== Boolean(endOdometer)) {
      setErrorMessage(
        "Дата завершення та кінцевий одометр повинні бути вказані разом."
      );
      return;
    }

    if (
      parsedEndOdometer !== null &&
      (!Number.isFinite(parsedEndOdometer) ||
        parsedEndOdometer < parsedStartOdometer)
    ) {
      setErrorMessage(
        "Кінцевий одометр не може бути меншим за початковий."
      );
      return;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      setErrorMessage(
        "Дата завершення не може бути раніше дати початку."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updateRouteEntry(route.id, {
        vehicleId,
        routeTypeId,
        startDate,
        startOdometer: parsedStartOdometer,
        endDate: endDate || null,
        endOdometer: parsedEndOdometer,
        totalDistance:
          parsedEndOdometer === null
            ? null
            : parsedEndOdometer - parsedStartOdometer,
        driverPayment: parsedDriverPayment,
        revenue: parsedRevenue,
      });

      await onUpdated();
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="route-details-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="route-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-route-title"
      >
        <header className="route-details-modal__header">
          <div>
            <h2 id="edit-route-title">Редагувати маршрут</h2>
            <p>Оновіть основні дані поїздки.</p>
          </div>

          <button
            type="button"
            className="route-details-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="route-details-modal__body">
            <div className="route-details-form-grid">
              <label>
                <span>Автомобіль</span>
                <select
                  autoFocus
                  value={vehicleId}
                  disabled={isSubmitting}
                  onChange={(event) => setVehicleId(event.target.value)}
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Тип маршруту</span>
                <select
                  value={routeTypeId}
                  disabled={isSubmitting}
                  onChange={(event) => setRouteTypeId(event.target.value)}
                >
                  {routeTypes.map((routeType) => (
                    <option key={routeType.id} value={routeType.id}>
                      {routeType.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Дата початку</span>
                <input
                  type="datetime-local"
                  value={startDate}
                  disabled={isSubmitting}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </label>

              <label>
                <span>Дата завершення</span>
                <input
                  type="datetime-local"
                  value={endDate}
                  disabled={isSubmitting}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </label>

              <label>
                <span>Початковий одометр</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={startOdometer}
                  disabled={isSubmitting}
                  onChange={(event) => setStartOdometer(event.target.value)}
                />
              </label>

              <label>
                <span>Кінцевий одометр</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={endOdometer}
                  disabled={isSubmitting}
                  onChange={(event) => setEndOdometer(event.target.value)}
                />
              </label>

              <label>
                <span>Дохід компанії, грн</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={revenue}
                  disabled={isSubmitting}
                  onChange={(event) => setRevenue(event.target.value)}
                />
              </label>

              <label>
                <span>Оплата водію, грн</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={driverPayment}
                  disabled={isSubmitting}
                  onChange={(event) => setDriverPayment(event.target.value)}
                />
              </label>
            </div>

            {errorMessage && (
              <p className="route-details-modal__error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <footer className="route-details-modal__footer">
            <button
              type="button"
              className="route-details-modal-button route-details-modal-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="route-details-modal-button route-details-modal-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default EditRouteModal;