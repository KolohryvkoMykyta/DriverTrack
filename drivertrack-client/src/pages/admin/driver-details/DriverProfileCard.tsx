import {
  Pencil,
  Phone,
  Power,
} from "lucide-react";

import type {
  Driver,
} from "../../../api/driversApi";

type DriverProfileCardProps = {
  driver: Driver;
  isChangingStatus: boolean;

  onEdit: () => void;
  onToggleStatus: () => void;
};

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "В";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function DriverProfileCard({
  driver,
  isChangingStatus,
  onEdit,
  onToggleStatus,
}: DriverProfileCardProps) {
  return (
    <section className="driver-profile-card">
      <div className="driver-profile-card__identity">
        <span
          className="driver-profile-card__avatar"
          aria-hidden="true"
        >
          {getInitials(driver.name)}
        </span>

        <div className="driver-profile-card__content">
          <div className="driver-profile-card__title">
            <h2>{driver.name}</h2>

            <span
              className={
                driver.isActive
                  ? "driver-profile-card__status driver-profile-card__status--active"
                  : "driver-profile-card__status driver-profile-card__status--inactive"
              }
            >
              {driver.isActive
                ? "Активний"
                : "Неактивний"}
            </span>
          </div>

          <span className="driver-profile-card__phone">
            <Phone
              size={17}
              strokeWidth={2}
            />

            {driver.phoneNumber?.trim()
              ? driver.phoneNumber
              : "Не вказано"}
          </span>
        </div>
      </div>

      <div className="driver-profile-card__actions">
        <button
          type="button"
          className="driver-profile-button driver-profile-button--edit"
          onClick={onEdit}
        >
          <Pencil size={17} />

          Редагувати
        </button>

        <button
          type="button"
          disabled={isChangingStatus}
          className={
            driver.isActive
              ? "driver-profile-button driver-profile-button--deactivate"
              : "driver-profile-button driver-profile-button--activate"
          }
          onClick={onToggleStatus}
        >
          <Power size={17} />

          {isChangingStatus
            ? "Збереження..."
            : driver.isActive
              ? "Деактивувати"
              : "Активувати"}
        </button>
      </div>
    </section>
  );
}

export default DriverProfileCard;