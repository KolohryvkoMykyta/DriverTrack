import { ChevronRight, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

import type { RouteEntry } from "../../../api/routeEntriesApi";
import type { RouteType } from "../../../api/routeTypesApi";
import type { Vehicle } from "../../../api/vehiclesApi";
import DriverDataPagination from "./DriverDataPagination";

type DriverRoutesPanelProps = {
  routes: RouteEntry[];
  vehicles: Vehicle[];
  routeTypes: RouteType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : numberFormatter.format(value);
}

function formatMoney(value: number) {
  return `${numberFormatter.format(value)} грн`;
}

function getVehicle(vehicles: Vehicle[], vehicleId: string) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId);
}

function getRouteName(routeTypes: RouteType[], routeTypeId: string) {
  return routeTypes.find((routeType) => routeType.id === routeTypeId)?.name ?? "Маршрут";
}

function DriverRoutesPanel({
  routes,
  vehicles,
  routeTypes,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: DriverRoutesPanelProps) {
  return (
    <div className="driver-entries-panel">
      <div className="driver-data-header">
        <div>
          <h2 className="driver-data-title">Маршрути</h2>
          <p className="driver-data-description">
            Маршрути водія за обраними фільтрами
          </p>
        </div>

        <span className="driver-data-count">{totalCount}</span>
      </div>

      {totalCount === 0 ? (
        <div className="driver-entry-empty">
          <div className="driver-entry-empty__icon">
            <MapPinned size={24} />
          </div>
          <strong>Маршрути не знайдено</strong>
          <p>Змініть період або обраний автомобіль.</p>
        </div>
      ) : (
        <div className="driver-route-table">
          <div className="driver-route-table__head" aria-hidden="true">
            <span>Маршрут</span>
            <span>Автомобіль</span>
            <span>Дата</span>
            <span>Пробіг</span>
            <span>Пальне</span>
            <span>Дохід</span>
            <span>Водію</span>
            <span>Статус</span>
          </div>

          {routes.map((route) => {
            const vehicle = getVehicle(vehicles, route.vehicleId);

            return (
              <Link
                key={route.id}
                to={`/admin/routes/${route.id}`}
                className="driver-route-row"
              >
                <div className="driver-route-cell driver-route-cell--name">
                  <strong>{getRouteName(routeTypes, route.routeTypeId)}</strong>
                </div>

                <div className="driver-route-cell driver-route-cell--vehicle">
                  <strong>
                    {vehicle
                      ? `${vehicle.brand} ${vehicle.model}`
                      : "Невідомий автомобіль"}
                  </strong>
                  <small>{vehicle?.licensePlate ?? "—"}</small>
                </div>

                <span className="driver-route-cell driver-route-cell--date">
                  {dateFormatter.format(new Date(route.startDate))}
                </span>

                <strong className="driver-route-cell driver-route-cell--distance">
                  {formatNumber(route.totalDistance)} км
                </strong>

                <strong className="driver-route-cell driver-route-cell--fuel">
                  {route.fuelUsed === null || route.fuelUsed === undefined
                    ? "—"
                    : `${formatNumber(route.fuelUsed)} л`}
                </strong>

                <strong className="driver-route-cell driver-route-cell--revenue">
                  {formatMoney(route.revenue)}
                </strong>

                <strong className="driver-route-cell driver-route-cell--salary">
                  {formatMoney(route.driverPayment)}
                </strong>

                <span
                  className={
                    route.endDate
                      ? "driver-entry-badge driver-entry-badge--complete"
                      : "driver-entry-badge driver-entry-badge--progress"
                  }
                >
                  {route.endDate ? "Завершено" : "У процесі"}
                </span>

                <ChevronRight className="driver-route-row__arrow" size={19} />
              </Link>
            );
          })}
        </div>
      )}

      <DriverDataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default DriverRoutesPanel;