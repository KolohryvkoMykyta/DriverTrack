import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import {
  getApiErrorMessage,
} from "../../../api/apiErrorHandler";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import {
  createVehicle,
} from "../../../api/vehiclesApi";

type CreateVehicleModalProps = {
  drivers: DriverListItem[];
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function CreateVehicleModal({
  drivers,
  onClose,
  onCreated,
}: CreateVehicleModalProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const [licensePlate, setLicensePlate] =
    useState("");

  const [selectedDriverId, setSelectedDriverId] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const activeDrivers = drivers.filter(
    (driver) => driver.isActive
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

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.classList.add(
      "vehicles-modal-open"
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.classList.remove(
        "vehicles-modal-open"
      );
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await createVehicle({
        brand,
        model,
        licensePlate,
        driverId: selectedDriverId || null,
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
      className="vehicles-modal"
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
        className="vehicles-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-vehicle-title"
        aria-describedby="create-vehicle-description"
      >
        <header className="vehicles-modal__header">
          <div>
            <h2 id="create-vehicle-title">
              Додати автомобіль
            </h2>

            <p id="create-vehicle-description">
              Заповніть основні дані нового
              автомобіля.
            </p>
          </div>

          <button
            type="button"
            className="vehicles-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="vehicles-form"
          onSubmit={handleSubmit}
        >
          <label className="vehicles-form__field">
            <span>Марка</span>

            <input
              autoFocus
              value={brand}
              onChange={(event) =>
                setBrand(event.target.value)
              }
              required
            />
          </label>

          <label className="vehicles-form__field">
            <span>Модель</span>

            <input
              value={model}
              onChange={(event) =>
                setModel(event.target.value)
              }
              required
            />
          </label>

          <label className="vehicles-form__field">
            <span>Державний номер</span>

            <input
              value={licensePlate}
              onChange={(event) =>
                setLicensePlate(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label className="vehicles-form__field">
            <span>Водій</span>

            <select
              value={selectedDriverId}
              onChange={(event) =>
                setSelectedDriverId(
                  event.target.value
                )
              }
            >
              <option value="">
                Не призначено
              </option>

              {activeDrivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.name}
                </option>
              ))}
            </select>
          </label>

          {errorMessage && (
            <p
              className="vehicles-form__error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <footer className="vehicles-form__actions">
            <button
              type="button"
              className="vehicles-button vehicles-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="vehicles-button vehicles-button--primary"
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

export default CreateVehicleModal;