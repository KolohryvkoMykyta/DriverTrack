import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  closeDriverRoute,
  openDriverRoute,
  type DriverRouteType,
  type DriverVehicle,
  type OpenDriverRoute,
} from "../../api/driverApi";
import { getApiErrorMessage } from "../../api/apiErrorHandler";

type DriverRouteModalProps = {
  route: OpenDriverRoute | null;
  vehicles: DriverVehicle[];
  routeTypes: DriverRouteType[];
  onClose: () => void;
  onSaved: () => void;
};

function getLocalDateTime() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function DriverRouteModal({
  route,
  vehicles,
  routeTypes,
  onClose,
  onSaved,
}: DriverRouteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [vehicleId, setVehicleId] = useState(
    vehicles.length === 1 ? vehicles[0].id : ""
  );
  const [routeTypeId, setRouteTypeId] = useState("");
  const [odometer, setOdometer] = useState("");
  const [date, setDate] = useState(getLocalDateTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isClosing = route !== null;

  const title = isClosing
    ? "Завершити маршрут"
    : "Розпочати маршрут";

  const selectedRouteType = routeTypes.find(
    (item) => item.id === routeTypeId
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => {
      dialog?.close();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const reading = Number(odometer);
    const selectedDate = new Date(date);

    if (
      !odometer.trim() ||
      !Number.isFinite(reading) ||
      reading < 0
    ) {
      setError("Вкажіть коректний показник одометра.");
      return;
    }

    if (!date || Number.isNaN(selectedDate.getTime())) {
      setError("Вкажіть коректні дату й час.");
      return;
    }

    if (selectedDate.getTime() > Date.now()) {
      setError("Дата й час не можуть бути в майбутньому.");
      return;
    }

    if (route) {
      if (reading < route.startOdometer) {
        setError(
          "Кінцевий показник одометра не може бути меншим за початковий."
        );
        return;
      }

      if (
        selectedDate.getTime() <
        new Date(route.startDate).getTime()
      ) {
        setError(
          "Дата завершення не може бути раніше дати початку."
        );
        return;
      }
    } else if (!vehicleId || !routeTypeId) {
      setError("Оберіть автомобіль і тип маршруту.");
      return;
    }

    setIsSubmitting(true);

    try {
      const utcDate = selectedDate.toISOString();

      if (route) {
        await closeDriverRoute(route.id, {
          endOdometer: reading,
          endDate: utcDate,
        });
      } else {
        await openDriverRoute({
          vehicleId,
          routeTypeId,
          startOdometer: reading,
          startDate: utcDate,
        });
      }
    } catch (error: unknown) {
      setError(getApiErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    onSaved();
  }

  return (
    <dialog
      ref={dialogRef}
      className="driver-modal"
      aria-labelledby="driver-route-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="driver-modal__header">
        <h2 id="driver-route-modal-title">{title}</h2>

        <button
          type="button"
          className="driver-modal__close"
          aria-label="Закрити"
          disabled={isSubmitting}
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset
          className="driver-modal__fields"
          disabled={isSubmitting}
        >
          {route ? (
            <p className="driver-modal__hint">
              Початковий одометр:{" "}
              <strong>
                {new Intl.NumberFormat("uk-UA").format(
                  route.startOdometer
                )}{" "}
                км
              </strong>
            </p>
          ) : (
            <>
              <label>
                Тип маршруту
                <select
                  value={routeTypeId}
                  required
                  onChange={(event) =>
                    setRouteTypeId(event.target.value)
                  }
                >
                  <option value="">Оберіть тип маршруту</option>

                  {routeTypes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              {selectedRouteType && (
                <p className="driver-modal__hint">
                  Оплата за маршрут:{" "}
                  <strong>
                    {new Intl.NumberFormat("uk-UA").format(
                      selectedRouteType.driverPayment
                    )}{" "}
                    грн
                  </strong>
                </p>
              )}

              <label>
                Автомобіль
                <select
                  value={vehicleId}
                  required
                  onChange={(event) =>
                    setVehicleId(event.target.value)
                  }
                >
                  <option value="">Оберіть автомобіль</option>

                  {vehicles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.brand} {item.model} ·{" "}
                      {item.licensePlate}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label>
            {isClosing
              ? "Кінцевий одометр, км"
              : "Початковий одометр, км"}

            <input
              type="number"
              min={route?.startOdometer ?? 0}
              step="any"
              inputMode="decimal"
              value={odometer}
              required
              placeholder={
                route ? String(route.startOdometer) : "Наприклад, 124580"
              }
              onChange={(event) =>
                setOdometer(event.target.value)
              }
            />
          </label>

          <label>
            {isClosing
              ? "Дата й час завершення"
              : "Дата й час початку"}

            <input
              type="datetime-local"
              step="1"
              value={date}
              required
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </fieldset>

        {error && (
          <p className="driver-modal__error" role="alert">
            {error}
          </p>
        )}

        <div className="driver-modal__actions">
          <button
            type="button"
            className="driver-button driver-button--secondary"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Скасувати
          </button>

          <button
            type="submit"
            className="driver-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Збереження…" : title}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default DriverRouteModal;