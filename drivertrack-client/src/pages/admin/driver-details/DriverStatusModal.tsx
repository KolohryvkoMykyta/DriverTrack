import { useEffect } from "react";
import { Power, X } from "lucide-react";

type DriverStatusModalProps = {
  driverName: string;
  isActive: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
};

function DriverStatusModal({
  driverName,
  isActive,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: DriverStatusModalProps) {
  const action = isActive ? "деактивувати" : "активувати";
  const actionLabel = isActive ? "Деактивувати" : "Активувати";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

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
        className="driver-modal driver-modal--confirmation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="driver-status-title"
      >
        <div className="driver-modal__header driver-modal__header--compact">
          <div className={`driver-status-modal__icon ${isActive ? "driver-status-modal__icon--danger" : "driver-status-modal__icon--success"}`}>
            <Power size={22} />
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

        <div className="driver-status-modal__content">
          <h2 id="driver-status-title">
            {actionLabel} водія?
          </h2>

          <p>
            Ви впевнені, що хочете {action} водія{" "}
            <strong>{driverName}</strong>?
          </p>

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
            type="button"
            className={`driver-modal-button ${isActive ? "driver-modal-button--danger" : "driver-modal-button--success"}`}
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? "Збереження..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DriverStatusModal;