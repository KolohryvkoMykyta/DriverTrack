import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

import {
  getDriverById,
  updateDriver,
  type Driver,
} from "../../../api/driversApi";
import { getApiErrorMessage } from "../../../api/apiErrorHandler";

type EditDriverModalProps = {
  driver: Driver;
  onClose: () => void;
  onUpdated: (driver: Driver) => void;
};

function EditDriverModal({
  driver,
  onClose,
  onUpdated,
}: EditDriverModalProps) {
  const [name, setName] = useState(driver.name);
  const [phoneNumber, setPhoneNumber] = useState(driver.phoneNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedPhoneNumber = phoneNumber.trim();

    if (!normalizedName) {
      setErrorMessage("Вкажіть ім’я водія.");
      return;
    }

    if (!normalizedPhoneNumber) {
      setErrorMessage("Вкажіть телефон водія.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updateDriver(driver.id, {
        name: normalizedName,
        phoneNumber: normalizedPhoneNumber,
        isActive: driver.isActive,
      });

      const updatedDriver = await getDriverById(driver.id);
      onUpdated(updatedDriver);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="driver-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="driver-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-driver-title"
      >
        <div className="driver-modal__header">
          <div>
            <h2 id="edit-driver-title">Редагувати водія</h2>
            <p>Оновіть основні дані облікового запису.</p>
          </div>

          <button
            type="button"
            className="driver-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="driver-modal__body">
            <label className="driver-modal-field">
              <span>Ім’я</span>
              <input
                autoFocus
                value={name}
                disabled={isSubmitting}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="driver-modal-field">
              <span>Телефон</span>
              <input
                value={phoneNumber}
                disabled={isSubmitting}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </label>

            {errorMessage && (
              <p className="driver-modal__error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="driver-modal__footer">
            <button
              type="button"
              className="driver-modal-button driver-modal-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="driver-modal-button driver-modal-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDriverModal;