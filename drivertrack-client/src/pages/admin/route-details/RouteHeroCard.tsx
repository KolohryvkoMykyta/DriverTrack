import {
  CalendarDays,
  Car,
  MapPinned,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import type { RouteDetails } from "../../../api/routeEntriesApi";

type RouteHeroCardProps = {
  route: RouteDetails;
  routeTypeName: string;
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

function RouteHeroCard({
  route,
  routeTypeName,
  driverName,
  vehicleName,
  licensePlate,
  onEdit,
  onDelete,
}: RouteHeroCardProps) {
  const isCompleted = Boolean(route.endDate);

  return (
    <section className="route-details-hero">
      <div className="route-details-hero__identity">
        <span
          className="route-details-hero__icon"
          aria-hidden="true"
        >
          <MapPinned size={34} strokeWidth={1.9} />
        </span>

        <div className="route-details-hero__content">
          <div className="route-details-hero__title-row">
            <h2>{routeTypeName}</h2>

            <span
              className={
                isCompleted
                  ? "route-details-status route-details-status--completed"
                  : "route-details-status route-details-status--progress"
              }
            >
              {isCompleted ? "Завершено" : "У процесі"}
            </span>
          </div>

          <div className="route-details-hero__date">
            <CalendarDays size={17} />

            <span>
              {formatDateTime(route.startDate)}
              {route.endDate
                ? ` — ${formatDateTime(route.endDate)}`
                : " — маршрут триває"}
            </span>
          </div>

          <div className="route-details-hero__meta">
            <span>
              <UserRound size={17} />
              {driverName}
            </span>

            <span>
              <Car size={17} />
              {vehicleName} · {licensePlate}
            </span>
          </div>
        </div>
      </div>

      <div className="route-details-hero__actions">
        <button
          type="button"
          className="route-details-button route-details-button--edit"
          onClick={onEdit}
        >
          <Pencil size={17} />
          Редагувати
        </button>

        <button
          type="button"
          className="route-details-button route-details-button--delete"
          onClick={onDelete}
        >
          <Trash2 size={17} />
          Видалити
        </button>
      </div>
    </section>
  );
}

export default RouteHeroCard;