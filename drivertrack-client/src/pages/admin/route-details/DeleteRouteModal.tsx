import { Trash2, X } from "lucide-react";

type DeleteRouteModalProps = {
  routeTypeName: string;
  isDeleting: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteRouteModal({
  routeTypeName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteRouteModalProps) {
  return (
    <div
      className="route-details-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="route-details-modal route-details-modal--confirmation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-route-title"
      >
        <header className="route-details-confirmation__header">
          <span aria-hidden="true">
            <Trash2 size={22} />
          </span>

          <button
            type="button"
            className="route-details-modal__close"
            aria-label="Закрити"
            disabled={isDeleting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="route-details-confirmation__content">
          <h2 id="delete-route-title">Видалити маршрут?</h2>

          <p>
            Маршрут «{routeTypeName}» буде видалено без можливості
            відновлення.
          </p>

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
            disabled={isDeleting}
            onClick={onClose}
          >
            Скасувати
          </button>

          <button
            type="button"
            className="route-details-modal-button route-details-modal-button--danger"
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

export default DeleteRouteModal;