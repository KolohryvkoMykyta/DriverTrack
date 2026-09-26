import { Trash2, X } from "lucide-react";

type DeleteFuelModalProps = {
  vehicleName: string;
  isDeleting: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteFuelModal({
  vehicleName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteFuelModalProps) {
  return (
    <div
      className="fuel-details-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="fuel-details-modal fuel-details-modal--confirmation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-fuel-title"
      >
        <header className="fuel-details-confirmation__header">
          <span aria-hidden="true">
            <Trash2 size={22} />
          </span>
          <button
            type="button"
            className="fuel-details-modal__close"
            aria-label="Закрити"
            disabled={isDeleting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="fuel-details-confirmation__content">
          <h2 id="delete-fuel-title">Видалити заправку?</h2>
          <p>
            Заправку автомобіля «{vehicleName}» буде видалено. Показники
            наступних заправок перерахуються автоматично.
          </p>

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
            disabled={isDeleting}
            onClick={onClose}
          >
            Скасувати
          </button>
          <button
            type="button"
            className="fuel-details-modal-button fuel-details-modal-button--danger"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Видалення..." : "Видалити"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default DeleteFuelModal;
