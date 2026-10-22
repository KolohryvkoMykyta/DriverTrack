import { useEffect, useState } from "react";

import {
  getCurrentUser,
  type CurrentUser,
} from "../api/authApi";
import { getApiErrorMessage } from "../api/apiErrorHandler";
import LogoutButton from "../components/LogoutButton";
import { Outlet } from "react-router-dom";

import "../styles/admin-layout.css";
import "../styles/driver-dashboard.css";

function DriverLayout() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user = await getCurrentUser();

        if (cancelled) return;

        setCurrentUser(user);
        setError("");
      } catch (error: unknown) {
        if (cancelled) return;

        setError(getApiErrorMessage(error));
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setError("");
    setAttempt((value) => value + 1);
  }

  return (
    <div className="admin-layout driver-layout">
      <div className="admin-content">
        <header className="admin-header driver-header">
          <div className="driver-header__brand">
            DriverTrack
          </div>

          <details className="driver-profile">
            <summary className="driver-profile__trigger">
              <span className="admin-user-menu__identity">
                <strong className="admin-user-menu__name">
                  {currentUser?.displayName || "Водій"}
                </strong>

                <span className="admin-user-menu__email">
                  {currentUser?.email}
                </span>
              </span>

              <span
                className="admin-user-menu__avatar"
                aria-hidden="true"
              >
                {(currentUser?.displayName.trim() || "В")
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            </summary>

            <div className="admin-user-menu__dropdown">
              <div className="admin-user-menu__details">
                <strong>
                  {currentUser?.displayName || "Водій"}
                </strong>

                <span>{currentUser?.email}</span>
              </div>

              <div className="admin-user-menu__divider" />

              <div className="admin-user-menu__logout">
                <LogoutButton />
              </div>
            </div>
          </details>
        </header>

        <main className="admin-main driver-main">
          {error ? (
            <div
              className="driver-feedback"
              role="alert"
            >
              <p>{error}</p>

              <button
                type="button"
                className="driver-button"
                onClick={retry}
              >
                Спробувати ще раз
              </button>
            </div>
          ) : currentUser ? (
            <Outlet context={{ currentUser }} />
          ) : (
            <p role="status">
              Завантаження профілю…
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;