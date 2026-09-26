import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Car,
  CreditCard,
  Pencil,
  Power,
  UserRound,
  X,
} from "lucide-react";

import {
  getApiErrorMessage,
} from "../../../api/apiErrorHandler";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import {
  getVehicleById,
  updateVehicle,
  type Vehicle,
} from "../../../api/vehiclesApi";

type VehicleProfileCardProps = {
  vehicle: Vehicle;
  drivers: DriverListItem[];
  onUpdated: (
    vehicle: Vehicle
  ) => void;
};

type OpenModal =
  | "edit"
  | "status"
  | null;

function VehicleProfileCard({
  vehicle,
  drivers,
  onUpdated,
}: VehicleProfileCardProps) {
  const [openModal, setOpenModal] =
    useState<OpenModal>(null);

  const [brand, setBrand] =
    useState(vehicle.brand);

  const [model, setModel] =
    useState(vehicle.model);

  const [licensePlate, setLicensePlate] =
    useState(vehicle.licensePlate);

  const [driverId, setDriverId] =
    useState(vehicle.driverId ?? "");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const driverName = vehicle.driverId
    ? drivers.find(
        (driver) =>
          driver.id === vehicle.driverId
      )?.name ?? "Невідомий водій"
    : "Не призначено";

  const availableDrivers = drivers.filter(
    (driver) =>
      driver.isActive ||
      driver.id === vehicle.driverId
  );

  useEffect(() => {
    if (!openModal) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        setOpenModal(null);
        setErrorMessage("");
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [openModal, isSubmitting]);

  function openEditModal() {
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setLicensePlate(
      vehicle.licensePlate
    );
    setDriverId(vehicle.driverId ?? "");
    setErrorMessage("");
    setOpenModal("edit");
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setOpenModal(null);
    setErrorMessage("");
  }

  async function loadUpdatedVehicle() {
    const updatedVehicle =
      await getVehicleById(vehicle.id);

    onUpdated(updatedVehicle);

    return updatedVehicle;
  }

  async function handleEditSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    const normalizedBrand =
      brand.trim();

    const normalizedModel =
      model.trim();

    const normalizedLicensePlate =
      licensePlate.trim();

    if (
      !normalizedBrand ||
      !normalizedModel ||
      !normalizedLicensePlate
    ) {
      setErrorMessage(
        "Заповніть марку, модель та державний номер."
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updateVehicle(vehicle.id, {
        brand: normalizedBrand,
        model: normalizedModel,
        licensePlate:
          normalizedLicensePlate,
        isActive: vehicle.isActive,
        driverId: driverId || null,
      });

      await loadUpdatedVehicle();

      setOpenModal(null);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusConfirm() {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updateVehicle(vehicle.id, {
        brand: vehicle.brand,
        model: vehicle.model,
        licensePlate:
          vehicle.licensePlate,
        isActive: !vehicle.isActive,
        driverId: vehicle.driverId,
      });

      await loadUpdatedVehicle();

      setOpenModal(null);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="vehicle-profile-card">
        <div className="vehicle-profile-card__identity">
          <span
            className="vehicle-profile-card__avatar"
            aria-hidden="true"
          >
            <Car
              size={32}
              strokeWidth={1.9}
            />
          </span>

          <div className="vehicle-profile-card__content">
            <div className="vehicle-profile-card__title">
              <h2>
                {vehicle.brand}{" "}
                {vehicle.model}
              </h2>

              <span
                className={
                  vehicle.isActive
                    ? "vehicle-profile-card__status vehicle-profile-card__status--active"
                    : "vehicle-profile-card__status vehicle-profile-card__status--inactive"
                }
              >
                {vehicle.isActive
                  ? "Активний"
                  : "Неактивний"}
              </span>
            </div>

            <div className="vehicle-profile-card__meta">
              <span>
                <CreditCard
                  size={17}
                  strokeWidth={2}
                />

                {vehicle.licensePlate}
              </span>

              <span>
                <UserRound
                  size={17}
                  strokeWidth={2}
                />

                Водій: {driverName}
              </span>
            </div>
          </div>
        </div>

        <div className="vehicle-profile-card__actions">
          <button
            type="button"
            className="vehicle-profile-button vehicle-profile-button--edit"
            onClick={openEditModal}
          >
            <Pencil size={17} />

            Редагувати
          </button>

          <button
            type="button"
            className={
              vehicle.isActive
                ? "vehicle-profile-button vehicle-profile-button--deactivate"
                : "vehicle-profile-button vehicle-profile-button--activate"
            }
            onClick={() => {
              setErrorMessage("");
              setOpenModal("status");
            }}
          >
            <Power size={17} />

            {vehicle.isActive
              ? "Деактивувати"
              : "Активувати"}
          </button>
        </div>
      </section>

      {openModal === "edit" && (
        <div
          className="vehicle-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <section
            className="vehicle-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-vehicle-title"
          >
            <header className="vehicle-modal__header">
              <div>
                <h2 id="edit-vehicle-title">
                  Редагувати автомобіль
                </h2>

                <p>
                  Оновіть основні дані
                  автомобіля.
                </p>
              </div>

              <button
                type="button"
                className="vehicle-modal__close"
                aria-label="Закрити"
                disabled={isSubmitting}
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={handleEditSubmit}
            >
              <div className="vehicle-modal__body">
                <label className="vehicle-modal-field">
                  <span>Марка</span>

                  <input
                    autoFocus
                    value={brand}
                    disabled={
                      isSubmitting
                    }
                    onChange={(event) =>
                      setBrand(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="vehicle-modal-field">
                  <span>Модель</span>

                  <input
                    value={model}
                    disabled={
                      isSubmitting
                    }
                    onChange={(event) =>
                      setModel(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="vehicle-modal-field">
                  <span>
                    Державний номер
                  </span>

                  <input
                    value={licensePlate}
                    disabled={
                      isSubmitting
                    }
                    onChange={(event) =>
                      setLicensePlate(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="vehicle-modal-field">
                  <span>Водій</span>

                  <select
                    value={driverId}
                    disabled={
                      isSubmitting
                    }
                    onChange={(event) =>
                      setDriverId(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Не призначено
                    </option>

                    {availableDrivers.map(
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

                {errorMessage && (
                  <p
                    className="vehicle-modal__error"
                    role="alert"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              <footer className="vehicle-modal__footer">
                <button
                  type="button"
                  className="vehicle-modal-button vehicle-modal-button--secondary"
                  disabled={isSubmitting}
                  onClick={closeModal}
                >
                  Скасувати
                </button>

                <button
                  type="submit"
                  className="vehicle-modal-button vehicle-modal-button--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Збереження..."
                    : "Зберегти"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {openModal === "status" && (
        <div
          className="vehicle-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <section
            className="vehicle-modal vehicle-modal--confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-status-title"
          >
            <header className="vehicle-modal__header vehicle-modal__header--compact">
              <span
                className={
                  vehicle.isActive
                    ? "vehicle-status-modal__icon vehicle-status-modal__icon--danger"
                    : "vehicle-status-modal__icon vehicle-status-modal__icon--success"
                }
              >
                <Power size={22} />
              </span>

              <button
                type="button"
                className="vehicle-modal__close"
                aria-label="Закрити"
                disabled={isSubmitting}
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            <div className="vehicle-status-modal__content">
              <h2 id="vehicle-status-title">
                {vehicle.isActive
                  ? "Деактивувати автомобіль?"
                  : "Активувати автомобіль?"}
              </h2>

              <p>
                Ви впевнені, що хочете{" "}
                {vehicle.isActive
                  ? "деактивувати"
                  : "активувати"}{" "}
                автомобіль{" "}
                <strong>
                  {vehicle.brand}{" "}
                  {vehicle.model}
                </strong>
                ?
              </p>

              {errorMessage && (
                <p
                  className="vehicle-modal__error"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <footer className="vehicle-modal__footer">
              <button
                type="button"
                className="vehicle-modal-button vehicle-modal-button--secondary"
                disabled={isSubmitting}
                onClick={closeModal}
              >
                Скасувати
              </button>

              <button
                type="button"
                className={
                  vehicle.isActive
                    ? "vehicle-modal-button vehicle-modal-button--danger"
                    : "vehicle-modal-button vehicle-modal-button--success"
                }
                disabled={isSubmitting}
                onClick={
                  handleStatusConfirm
                }
              >
                {isSubmitting
                  ? "Збереження..."
                  : vehicle.isActive
                    ? "Деактивувати"
                    : "Активувати"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

export default VehicleProfileCard;