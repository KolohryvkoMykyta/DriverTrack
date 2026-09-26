import { Trash2, X } from "lucide-react";

import type { RouteType } from "../../../api/routeTypesApi";

type DeleteRouteTypeModalProps = {
  routeType: RouteType;
  isDeleting: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteRouteTypeModal({
  routeType,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteRouteTypeModalProps) {
  return (
    <div
      className="route-types-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="route-types-modal route-types-modal--confirmation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-route-type-title"
      >
        <header className="route-types-confirmation__header">
          <span aria-hidden="true">
            <Trash2 size={22} />
          </span>
          <button
            type="button"
            className="route-types-modal__close"
            aria-label="Закрити"
            disabled={isDeleting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="route-types-confirmation__content">
          <h2 id="delete-route-type-title">Видалити тип маршруту?</h2>
          <p>
            Тип «{routeType.name}» буде видалено без можливості відновлення.
            Якщо він використовується в маршрутах, система може відхилити
            видалення.
          </p>

          {errorMessage && (
            <p className="route-types-modal__error" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <footer className="route-types-modal__footer">
          <button
            type="button"
            className="route-types-modal-button route-types-modal-button--secondary"
            disabled={isDeleting}
            onClick={onClose}
          >
            Скасувати
          </button>
          <button
            type="button"
            className="route-types-modal-button route-types-modal-button--danger"
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

export default DeleteRouteTypeModal;
