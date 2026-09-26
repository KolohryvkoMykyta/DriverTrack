import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import { getApiErrorMessage } from "../../../api/apiErrorHandler";
import {
  createRouteType,
  updateRouteType,
  type RouteType,
} from "../../../api/routeTypesApi";

type RouteTypeModalProps = {
  routeType: RouteType | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function RouteTypeModal({
  routeType,
  onClose,
  onSaved,
}: RouteTypeModalProps) {
  const [name, setName] = useState(routeType?.name ?? "");
  const [driverPayment, setDriverPayment] = useState(
    routeType ? String(routeType.driverPayment) : ""
  );
  const [revenue, setRevenue] = useState(
    routeType ? String(routeType.revenue) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = routeType !== null;
  const parsedRevenue = Number(revenue);
  const parsedDriverPayment = Number(driverPayment);
  const remainder =
    revenue && driverPayment &&
    Number.isFinite(parsedRevenue) &&
    Number.isFinite(parsedDriverPayment)
      ? parsedRevenue - parsedDriverPayment
      : null;

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.body.classList.add("route-types-modal-open");
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("route-types-modal-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim() || driverPayment === "" || revenue === "") {
      setErrorMessage("Заповніть усі поля.");
      return;
    }

    if (
      !Number.isFinite(parsedDriverPayment) ||
      parsedDriverPayment < 0 ||
      parsedDriverPayment > 10000 ||
      !Number.isFinite(parsedRevenue) ||
      parsedRevenue < 0 ||
      parsedRevenue > 100000
    ) {
      setErrorMessage("Перевірте введені фінансові значення.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const request = {
        name: name.trim(),
        driverPayment: parsedDriverPayment,
        revenue: parsedRevenue,
      };

      if (routeType) {
        await updateRouteType(routeType.id, request);
      } else {
        await createRouteType(request);
      }

      await onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="route-types-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="route-types-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="route-type-modal-title"
      >
        <header className="route-types-modal__header">
          <div>
            <h2 id="route-type-modal-title">
              {isEditing ? "Редагувати тип" : "Додати тип маршруту"}
            </h2>
            <p>Вкажіть назву та стандартні фінансові умови.</p>
          </div>
          <button
            type="button"
            className="route-types-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="route-types-modal__body">
            <label className="route-types-form-field">
              <span>Назва</span>
              <input
                autoFocus
                value={name}
                maxLength={50}
                disabled={isSubmitting}
                placeholder="Наприклад, Харків — Київ"
                onChange={(event) => {
                  setName(event.target.value);
                  setErrorMessage("");
                }}
              />
            </label>

            <div className="route-types-form-grid">
              <label className="route-types-form-field">
                <span>Дохід, грн</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="0.01"
                  value={revenue}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setRevenue(event.target.value);
                    setErrorMessage("");
                  }}
                />
              </label>

              <label className="route-types-form-field">
                <span>Оплата водію, грн</span>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="0.01"
                  value={driverPayment}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setDriverPayment(event.target.value);
                    setErrorMessage("");
                  }}
                />
              </label>
            </div>

            <div
              className={
                remainder !== null && remainder < 0
                  ? "route-types-form-remainder route-types-form-remainder--negative"
                  : "route-types-form-remainder"
              }
            >
              <span>Залишок до витрат на пальне</span>
              <strong>
                {remainder === null
                  ? "—"
                  : `${new Intl.NumberFormat("uk-UA", {
                      maximumFractionDigits: 2,
                    }).format(remainder)} грн`}
              </strong>
            </div>

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
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="route-types-modal-button route-types-modal-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Збереження..."
                : isEditing
                  ? "Зберегти"
                  : "Додати тип"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default RouteTypeModal;
