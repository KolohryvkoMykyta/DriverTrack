import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import { getApiErrorMessage } from "../../../api/apiErrorHandler";
import {
  updateFuelEntry,
  type FuelEntry,
} from "../../../api/fuelEntriesApi";

type EditFuelModalProps = {
  entry: FuelEntry;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

function EditFuelModal({
  entry,
  onClose,
  onUpdated,
}: EditFuelModalProps) {
  const [date, setDate] = useState(entry.date.slice(0, 16));
  const [odometerReading, setOdometerReading] = useState(
    String(entry.odometerReading)
  );
  const [liters, setLiters] = useState(String(entry.liters));
  const [isFullTank, setIsFullTank] = useState(entry.isFullTank);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.body.classList.add("fuel-details-modal-open");
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("fuel-details-modal-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const parsedOdometer = Number(odometerReading);
    const parsedLiters = Number(liters);

    if (!date || !odometerReading || !liters) {
      setErrorMessage("Заповніть усі поля заправки.");
      return;
    }

    if (
      !Number.isFinite(parsedOdometer) ||
      parsedOdometer < 0 ||
      !Number.isFinite(parsedLiters) ||
      parsedLiters <= 0
    ) {
      setErrorMessage("Перевірте показник одометра та кількість літрів.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await updateFuelEntry(entry.id, {
        date,
        odometerReading: parsedOdometer,
        liters: parsedLiters,
        isFullTank,
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
      className="fuel-details-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="fuel-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-fuel-title"
      >
        <header className="fuel-details-modal__header">
          <div>
            <h2 id="edit-fuel-title">Редагувати заправку</h2>
            <p>Оновіть основні дані заправки.</p>
          </div>
          <button
            type="button"
            className="fuel-details-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="fuel-details-modal__body">
            <div className="fuel-details-form-grid">
              <label className="fuel-details-form-grid__wide">
                <span>Дата і час</span>
                <input
                  autoFocus
                  type="datetime-local"
                  value={date}
                  disabled={isSubmitting}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              <label>
                <span>Одометр, км</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={odometerReading}
                  disabled={isSubmitting}
                  onChange={(event) => setOdometerReading(event.target.value)}
                />
              </label>
              <label>
                <span>Заправлено, л</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={liters}
                  disabled={isSubmitting}
                  onChange={(event) => setLiters(event.target.value)}
                />
              </label>
            </div>

            <label className="fuel-details-form-checkbox">
              <input
                type="checkbox"
                checked={isFullTank}
                disabled={isSubmitting}
                onChange={(event) => setIsFullTank(event.target.checked)}
              />
              <span>
                <strong>Повний бак</strong>
                <small>Автомобіль заправлено до повного бака</small>
              </span>
            </label>

            {errorMessage && (
              <p className="fuel-details-modal__error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <footer className="fuel-details-modal__footer">
            <button
              type="button"
              className="fuel-details-modal-button fuel-details-modal-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="fuel-details-modal-button fuel-details-modal-button--primary"
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

export default EditFuelModal;
