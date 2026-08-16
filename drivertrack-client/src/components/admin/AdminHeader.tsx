import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import type { CurrentUser } from "../../api/authApi";
import LogoutButton from "../LogoutButton";

type AdminHeaderProps = {
  currentUser: CurrentUser | null;
};

function getInitials(displayName?: string) {
  if (!displayName?.trim()) {
    return "A";
  }

  const words = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getPageTitle(pathname: string) {
  if (pathname === "/admin") {
    return "Огляд";
  }

  if (pathname === "/admin/drivers") {
    return "Водії";
  }

  if (pathname === "/admin/vehicles") {
    return "Автомобілі";
  }

  if (pathname === "/admin/routes") {
    return "Маршрути";
  }

  if (pathname === "/admin/fuel") {
    return "Заправки";
  }

  if (pathname === "/admin/route-types") {
    return "Типи маршрутів";
  }

  if (pathname.startsWith("/admin/drivers/")) {
    return "Деталі водія";
  }

  if (pathname.startsWith("/admin/vehicles/")) {
    return "Деталі автомобіля";
  }

  if (pathname.startsWith("/admin/routes/")) {
    return "Деталі маршруту";
  }

  if (pathname.startsWith("/admin/fuel/")) {
    return "Деталі заправки";
  }

  return "DriverTrack";
}

function AdminHeader({ currentUser }: AdminHeaderProps) {
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName =
    currentUser?.displayName || "Адміністратор";

  const initials = getInitials(displayName);
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleDocumentClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header__title">
        {pageTitle}
      </div>

      <div
        ref={userMenuRef}
        className="admin-user-menu"
      >
        <button
          type="button"
          className="admin-user-menu__trigger"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          onClick={() =>
            setIsUserMenuOpen((current) => !current)
          }
        >
          <span className="admin-user-menu__identity">
            <strong className="admin-user-menu__name">
              {displayName}
            </strong>

            {currentUser?.email && (
              <span className="admin-user-menu__email">
                {currentUser.email}
              </span>
            )}
          </span>

          <span
            className="admin-user-menu__avatar"
            aria-hidden="true"
          >
            {initials}
          </span>
        </button>

        {isUserMenuOpen && (
          <div
            className="admin-user-menu__dropdown"
            role="menu"
          >
            <div className="admin-user-menu__details">
              <strong>{displayName}</strong>

              {currentUser?.email && (
                <span>{currentUser.email}</span>
              )}
            </div>

            <div className="admin-user-menu__divider" />

            <div className="admin-user-menu__logout">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;