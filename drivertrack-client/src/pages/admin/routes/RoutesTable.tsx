import type {
  KeyboardEvent,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  MapPinned,
} from "lucide-react";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import type {
  RouteEntry,
} from "../../../api/routeEntriesApi";

import type {
  RouteType,
} from "../../../api/routeTypesApi";

import type {
  Vehicle,
} from "../../../api/vehiclesApi";

type RoutesTableProps = {
  routes: RouteEntry[];
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  routeTypes: RouteType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;

  onOpenRoute: (
    route: RouteEntry
  ) => void;

  onPageChange: (
    page: number
  ) => void;
};

const numberFormatter =
  new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 2,
  });

const dateFormatter =
  new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function formatNumber(
  value: number | null | undefined
) {
  return value === null ||
    value === undefined
    ? "—"
    : numberFormatter.format(value);
}

function formatMoney(value: number) {
  return `${numberFormatter.format(value)} грн`;
}

function RoutesTable({
  routes,
  drivers,
  vehicles,
  routeTypes,
  totalCount,
  currentPage,
  totalPages,
  onOpenRoute,
  onPageChange,
}: RoutesTableProps) {
  const driverNames = new Map(
    drivers.map((driver) => [
      driver.id,
      driver.name,
    ])
  );

  const vehiclesById = new Map(
    vehicles.map((vehicle) => [
      vehicle.id,
      vehicle,
    ])
  );

  const routeTypeNames = new Map(
    routeTypes.map((routeType) => [
      routeType.id,
      routeType.name,
    ])
  );

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    route: RouteEntry
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onOpenRoute(route);
    }
  }

  return (
    <section className="routes-table-card">
      <div className="routes-table-header">
        <div>
          <h2>Маршрути</h2>

          <p>
            Маршрути за обраними
            фільтрами
          </p>
        </div>

        <span>{totalCount}</span>
      </div>

      {totalCount === 0 ? (
        <div className="routes-table-empty">
          <span>
            <MapPinned size={24} />
          </span>

          <strong>
            Маршрути не знайдено
          </strong>

          <p>
            Змініть вибрані фільтри.
          </p>
        </div>
      ) : (
        <div className="routes-table-scroll">
          <table className="routes-table">
            <thead>
              <tr>
                <th>Маршрут</th>
                <th>Автомобіль</th>
                <th>Водій</th>
                <th>Дата</th>
                <th>Пробіг</th>
                <th>Пальне</th>
                <th>Дохід</th>
                <th>Водію</th>
                <th>Статус</th>
                <th aria-label="Дії" />
              </tr>
            </thead>

            <tbody>
              {routes.map((route) => {
                const vehicle =
                  vehiclesById.get(
                    route.vehicleId
                  );

                return (
                  <tr
                    key={route.id}
                    tabIndex={0}
                    className="routes-table__row"
                    aria-label="Відкрити деталі маршруту"
                    onClick={() =>
                      onOpenRoute(route)
                    }
                    onKeyDown={(event) =>
                      handleRowKeyDown(
                        event,
                        route
                      )
                    }
                  >
                    <td>
                      <strong className="routes-table__route">
                        {routeTypeNames.get(
                          route.routeTypeId
                        ) ??
                          "Невідомий маршрут"}
                      </strong>
                    </td>

                    <td>
                      <span className="routes-table__vehicle">
                        <strong>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : "Невідомий автомобіль"}
                        </strong>

                        <small>
                          {vehicle?.licensePlate ??
                            "—"}
                        </small>
                      </span>
                    </td>

                    <td>
                      {driverNames.get(
                        route.driverId
                      ) ??
                        "Невідомий водій"}
                    </td>

                    <td>
                      {dateFormatter.format(
                        new Date(
                          route.startDate
                        )
                      )}
                    </td>

                    <td>
                      <strong>
                        {route.totalDistance ===
                          null ||
                        route.totalDistance ===
                          undefined
                          ? "—"
                          : `${formatNumber(route.totalDistance)} км`}
                      </strong>
                    </td>

                    <td>
                      {route.fuelUsed ===
                        null ||
                      route.fuelUsed ===
                        undefined
                        ? "—"
                        : `${formatNumber(route.fuelUsed)} л`}
                    </td>

                    <td>
                      <strong>
                        {formatMoney(
                          route.revenue
                        )}
                      </strong>
                    </td>

                    <td>
                      {formatMoney(
                        route.driverPayment
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          route.endDate
                            ? "routes-table__status routes-table__status--complete"
                            : "routes-table__status routes-table__status--progress"
                        }
                      >
                        {route.endDate
                          ? "Завершено"
                          : "У процесі"}
                      </span>
                    </td>

                    <td>
                      <ChevronRight
                        className="routes-table__arrow"
                        size={19}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="routes-pagination">
          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              onPageChange(
                currentPage - 1
              )
            }
          >
            <ChevronLeft size={17} />

            Назад
          </button>

          <span>
            Сторінка{" "}
            <strong>
              {currentPage}
            </strong>{" "}
            з {totalPages}
          </span>

          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              onPageChange(
                currentPage + 1
              )
            }
          >
            Далі

            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}

export default RoutesTable;