import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";

import {
  registerDriver,
} from "../../../api/authApi";

import {
  getApiErrorMessage,
} from "../../../api/apiErrorHandler";

type CreateDriverModalProps = {
  onClose: () => void;
  onCreated: () => Promise<void>;
};

function CreateDriverModal({
  onClose,
  onCreated,
}: CreateDriverModalProps) {
  const [name, setName] = useState("");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

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
      "drivers-modal-open"
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.classList.remove(
        "drivers-modal-open"
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

      await registerDriver({
        name,
        phoneNumber,
        email,
        password,
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
      className="drivers-modal"
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
        className="drivers-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-driver-title"
        aria-describedby="create-driver-description"
      >
        <header className="drivers-modal__header">
          <div>
            <h2 id="create-driver-title">
              Додати водія
            </h2>

            <p id="create-driver-description">
              Створіть обліковий запис
              нового водія.
            </p>
          </div>

          <button
            type="button"
            className="drivers-modal__close"
            aria-label="Закрити"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="drivers-form"
          onSubmit={handleSubmit}
        >
          <label className="drivers-form__field">
            <span>Ім’я</span>

            <input
              autoFocus
              autoComplete="name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label className="drivers-form__field">
            <span>Телефон</span>

            <input
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label className="drivers-form__field">
            <span>Email</span>

            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label className="drivers-form__field">
            <span>Пароль</span>

            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />
          </label>

          {errorMessage && (
            <p
              className="drivers-form__error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <footer className="drivers-form__actions">
            <button
              type="button"
              className="drivers-button drivers-button--secondary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Скасувати
            </button>

            <button
              type="submit"
              className="drivers-button drivers-button--primary"
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

export default CreateDriverModal;