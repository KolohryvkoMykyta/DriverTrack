import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  X,
} from "lucide-react";

import {
  getApiErrorMessage,
} from "../../../api/apiErrorHandler";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import {
  createFullRoute,
} from "../../../api/routeEntriesApi";

import type {
  RouteType,
} from "../../../api/routeTypesApi";

import type {
  Vehicle,
} from "../../../api/vehiclesApi";

type CreateRouteModalProps = {
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  routeTypes: RouteType[];
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function CreateRouteModal({
  drivers,
  vehicles,
  routeTypes,
  onClose,
  onCreated,
}: CreateRouteModalProps) {
  const [driverId, setDriverId] =
    useState("");

  const [vehicleId, setVehicleId] =
    useState("");

  const [routeTypeId, setRouteTypeId] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [
    startOdometer,
    setStartOdometer,
  ] = useState("");

  const [
    endOdometer,
    setEndOdometer,
  ] = useState("");

  const [totalDistance, setTotalDistance] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const activeDrivers = drivers.filter(
    (driver) => driver.isActive
  );

  const availableVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.isActive &&
        (
          !driverId ||
          vehicle.driverId === driverId
        )
    );

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.classList.add(
      "routes-modal-open"
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.classList.remove(
        "routes-modal-open"
      );
    };
  }, [isSubmitting, onClose]);

  function updateTotalDistance(
    startValue: string,
    endValue: string
  ) {
    const start = Number(startValue);
    const end = Number(endValue);

    if (
      !startValue ||
      !endValue ||
      end < start
    ) {
      setTotalDistance("");
      return;
    }

    setTotalDistance(
      String(end - start)
    );
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      !driverId ||
      !vehicleId ||
      !routeTypeId ||
      !startDate ||
      !endDate ||
      !startOdometer ||
      !endOdometer ||
      !totalDistance
    ) {
      setErrorMessage(
        "Заповніть усі поля маршруту."
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await createFullRoute({
        driverId,
        vehicleId,
        routeTypeId,
        startDate,
        endDate,
        startOdometer:
          Number(startOdometer),
        endOdometer:
          Number(endOdometer),
        totalDistance:
          Number(totalDistance),
      });

      await onCreated();
      onClose();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="routes-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <section
        className="routes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-route-title"
      >
        <header className="routes-modal__header">
          <div>
            <h2 id="create-route-title">
              Додати маршрут
            </h2>

            <p>
              Заповніть дані нового
              завершеного маршруту.
            </p>
          </div>

          <button
            type="button"
            className="routes-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
        >
          <div className="routes-form">
            <div className="routes-form__grid">
              <label className="routes-form__field">
                <span>Водій</span>

                <select
                  autoFocus
                  value={driverId}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setDriverId(
                      event.target.value
                    );
                    setVehicleId("");
                    setErrorMessage("");
                  }}
                >
                  <option value="">
                    Оберіть водія
                  </option>

                  {activeDrivers.map(
                    (driver) => (
                      <option
                        key={driver.id}
                        value={driver.id}
                      >
                        {driver.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="routes-form__field">
                <span>Автомобіль</span>

                <select
                  value={vehicleId}
                  disabled={
                    isSubmitting ||
                    !driverId
                  }
                  onChange={(event) => {
                    setVehicleId(
                      event.target.value
                    );
                    setErrorMessage("");
                  }}
                >
                  <option value="">
                    {driverId
                      ? "Оберіть автомобіль"
                      : "Спочатку оберіть водія"}
                  </option>

                  {availableVehicles.map(
                    (vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.brand}{" "}
                        {vehicle.model} —{" "}
                        {
                          vehicle.licensePlate
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label className="routes-form__field">
              <span>Тип маршруту</span>

              <select
                value={routeTypeId}
                disabled={isSubmitting}
                onChange={(event) => {
                  setRouteTypeId(
                    event.target.value
                  );
                  setErrorMessage("");
                }}
              >
                <option value="">
                  Оберіть тип маршруту
                </option>

                {routeTypes.map(
                  (routeType) => (
                    <option
                      key={routeType.id}
                      value={routeType.id}
                    >
                      {routeType.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="routes-form__grid">
              <label className="routes-form__field">
                <span>Дата початку</span>

                <input
                  type="datetime-local"
                  value={startDate}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setStartDate(
                      event.target.value
                    );
                    setErrorMessage("");
                  }}
                />
              </label>

              <label className="routes-form__field">
                <span>
                  Дата завершення
                </span>

                <input
                  type="datetime-local"
                  value={endDate}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setEndDate(
                      event.target.value
                    );
                    setErrorMessage("");
                  }}
                />
              </label>
            </div>

            <div className="routes-form__grid">
              <label className="routes-form__field">
                <span>
                  Початковий одометр
                </span>

                <input
                  type="number"
                  min="0"
                  value={startOdometer}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setStartOdometer(
                      value
                    );

                    updateTotalDistance(
                      value,
                      endOdometer
                    );

                    setErrorMessage("");
                  }}
                />
              </label>

              <label className="routes-form__field">
                <span>
                  Кінцевий одометр
                </span>

                <input
                  type="number"
                  min="0"
                  value={endOdometer}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setEndOdometer(value);

                    updateTotalDistance(
                      startOdometer,
                      value
                    );

                    setErrorMessage("");
                  }}
                />
              </label>
            </div>

            <label className="routes-form__field">
              <span>
                Загальна відстань
              </span>

              <input
                type="number"
                min="0"
                value={totalDistance}
                disabled={isSubmitting}
                onChange={(event) => {
                  setTotalDistance(
                    event.target.value
                  );
                  setErrorMessage("");
                }}
              />
            </label>

            {errorMessage && (
              <p
                className="routes-form__error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </div>

          <footer className="routes-modal__footer">
            <button
              type="button"
              className="routes-button routes-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="routes-button routes-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Створення..."
                : "Створити"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateRouteModal;