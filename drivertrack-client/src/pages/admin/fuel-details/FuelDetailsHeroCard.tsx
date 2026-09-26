import {
  CalendarDays,
  Car,
  Fuel,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import type { FuelEntry } from "../../../api/fuelEntriesApi";

type FuelDetailsHeroCardProps = {
  entry: FuelEntry;
  driverName: string;
  vehicleName: string;
  licensePlate: string;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FuelDetailsHeroCard({
  entry,
  driverName,
  vehicleName,
  licensePlate,
  onEdit,
  onDelete,
}: FuelDetailsHeroCardProps) {
  return (
    <section className="fuel-details-hero">
      <div className="fuel-details-hero__identity">
        <span className="fuel-details-hero__icon" aria-hidden="true">
          <Fuel size={34} strokeWidth={1.9} />
        </span>

        <div className="fuel-details-hero__content">
          <div className="fuel-details-hero__title-row">
            <h2>Заправка · {vehicleName}</h2>
            <span
              className={
                entry.isFullTank
                  ? "fuel-details-status fuel-details-status--full"
                  : "fuel-details-status fuel-details-status--partial"
              }
            >
              {entry.isFullTank ? "Повний бак" : "Часткова заправка"}
            </span>
          </div>

          <div className="fuel-details-hero__date">
            <CalendarDays size={17} />
            {formatDateTime(entry.date)}
          </div>

          <div className="fuel-details-hero__meta">
            <span>
              <UserRound size={17} />
              {driverName}
            </span>
            <span>
              <Car size={17} />
              {licensePlate}
            </span>
          </div>
        </div>
      </div>

      <div className="fuel-details-hero__actions">
        <button
          type="button"
          className="fuel-details-button fuel-details-button--edit"
          onClick={onEdit}
        >
          <Pencil size={17} />
          Редагувати
        </button>
        <button
          type="button"
          className="fuel-details-button fuel-details-button--delete"
          onClick={onDelete}
        >
          <Trash2 size={17} />
          Видалити
        </button>
      </div>
    </section>
  );
}

export default FuelDetailsHeroCard;
