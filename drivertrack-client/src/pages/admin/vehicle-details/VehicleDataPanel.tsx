import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  MapPinned,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import type {
  FuelEntry,
} from "../../../api/fuelEntriesApi";

import type {
  RouteEntry,
} from "../../../api/routeEntriesApi";

import type {
  RouteType,
} from "../../../api/routeTypesApi";

export type VehicleDetailsTab =
  | "routes"
  | "fuel";

type VehicleDataPanelProps = {
  activeTab: VehicleDetailsTab;
  routes: RouteEntry[];
  fuelEntries: FuelEntry[];
  routeTypes: RouteType[];
  drivers: DriverListItem[];

  routesTotalCount: number;
  fuelTotalCount: number;

  routesCurrentPage: number;
  routesTotalPages: number;
  fuelCurrentPage: number;
  fuelTotalPages: number;

  onTabChange: (
    tab: VehicleDetailsTab
  ) => void;

  onRoutesPageChange: (
    page: number
  ) => void;

  onFuelPageChange: (
    page: number
  ) => void;
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
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

function formatDate(value: string) {
  return dateFormatter.format(
    new Date(value)
  );
}

function VehicleDataPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="vehicle-data-pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        <ChevronLeft size={17} />

        Назад
      </button>

      <span>
        Сторінка{" "}
        <strong>{currentPage}</strong> з{" "}
        {totalPages}
      </span>

      <button
        type="button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Далі

        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function VehicleDataPanel({
  activeTab,
  routes,
  fuelEntries,
  routeTypes,
  drivers,
  routesTotalCount,
  fuelTotalCount,
  routesCurrentPage,
  routesTotalPages,
  fuelCurrentPage,
  fuelTotalPages,
  onTabChange,
  onRoutesPageChange,
  onFuelPageChange,
}: VehicleDataPanelProps) {
  const driverNames = new Map(
    drivers.map((driver) => [
      driver.id,
      driver.name,
    ])
  );

  const routeTypeNames = new Map(
    routeTypes.map((routeType) => [
      routeType.id,
      routeType.name,
    ])
  );

  function getDriverName(
    driverId: string
  ) {
    return driverNames.get(driverId) ??
      "Невідомий водій";
  }

  function getRouteName(
    routeTypeId: string
  ) {
    return routeTypeNames.get(
      routeTypeId
    ) ?? "Невідомий маршрут";
  }

  return (
    <section className="vehicle-data-section">
      <div
        className="vehicle-details-tabs"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={
            activeTab === "routes"
          }
          className={
            activeTab === "routes"
              ? "vehicle-details-tab vehicle-details-tab--active"
              : "vehicle-details-tab"
          }
          onClick={() =>
            onTabChange("routes")
          }
        >
          Маршрути
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            activeTab === "fuel"
          }
          className={
            activeTab === "fuel"
              ? "vehicle-details-tab vehicle-details-tab--active"
              : "vehicle-details-tab"
          }
          onClick={() =>
            onTabChange("fuel")
          }
        >
          Заправки
        </button>
      </div>

      {activeTab === "routes" && (
        <div className="vehicle-data-panel">
          <div className="vehicle-data-header">
            <div>
              <h2>
                Маршрути
              </h2>

              <p>
                Маршрути автомобіля за
                обраний період
              </p>
            </div>

            <span>
              {routesTotalCount}
            </span>
          </div>

          {routesTotalCount === 0 ? (
            <div className="vehicle-data-empty">
              <span>
                <MapPinned size={24} />
              </span>

              <strong>
                Маршрути не знайдено
              </strong>

              <p>
                Змініть вибраний період.
              </p>
            </div>
          ) : (
            <div className="vehicle-table-scroll">
              <table className="vehicle-data-table vehicle-data-table--routes">
                <thead>
                  <tr>
                    <th>Маршрут</th>
                    <th>Дата</th>
                    <th>Пробіг</th>
                    <th>Пальне</th>
                    <th>Дохід</th>
                    <th>Водію</th>
                    <th>Водій</th>
                    <th>Статус</th>
                    <th aria-label="Дії" />
                  </tr>
                </thead>

                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td>
                        <Link
                          to={
                            `/admin/routes/${route.id}`
                          }
                          className="vehicle-table-primary-link"
                        >
                          {getRouteName(
                            route.routeTypeId
                          )}
                        </Link>
                      </td>

                      <td>
                        {formatDate(
                          route.startDate
                        )}
                      </td>

                      <td>
                        <strong>
                          {formatNumber(
                            route.totalDistance
                          )}{" "}
                          км
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
                        {getDriverName(
                          route.driverId
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            route.endDate
                              ? "vehicle-table-badge vehicle-table-badge--complete"
                              : "vehicle-table-badge vehicle-table-badge--progress"
                          }
                        >
                          {route.endDate
                            ? "Завершено"
                            : "У процесі"}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={
                            `/admin/routes/${route.id}`
                          }
                          className="vehicle-table-arrow"
                          aria-label="Відкрити маршрут"
                        >
                          <ChevronRight
                            size={19}
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <VehicleDataPagination
            currentPage={
              routesCurrentPage
            }
            totalPages={
              routesTotalPages
            }
            onPageChange={
              onRoutesPageChange
            }
          />
        </div>
      )}

      {activeTab === "fuel" && (
        <div className="vehicle-data-panel">
          <div className="vehicle-data-header">
            <div>
              <h2>
                Заправки
              </h2>

              <p>
                Заправки автомобіля за
                обраний період
              </p>
            </div>

            <span>
              {fuelTotalCount}
            </span>
          </div>

          {fuelTotalCount === 0 ? (
            <div className="vehicle-data-empty">
              <span className="vehicle-data-empty__icon--fuel">
                <Fuel size={24} />
              </span>

              <strong>
                Заправки не знайдено
              </strong>

              <p>
                Змініть вибраний період.
              </p>
            </div>
          ) : (
            <div className="vehicle-table-scroll">
              <table className="vehicle-data-table vehicle-data-table--fuel">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Водій</th>
                    <th>Одометр</th>
                    <th>Заправлено</th>
                    <th>Відстань</th>
                    <th>Витрата</th>
                    <th>Повний бак</th>
                    <th aria-label="Дії" />
                  </tr>
                </thead>

                <tbody>
                  {fuelEntries.map(
                    (fuelEntry) => (
                      <tr
                        key={fuelEntry.id}
                      >
                        <td>
                          <Link
                            to={
                              `/admin/fuel/${fuelEntry.id}`
                            }
                            className="vehicle-table-primary-link"
                          >
                            {formatDate(
                              fuelEntry.date
                            )}
                          </Link>
                        </td>

                        <td>
                          {getDriverName(
                            fuelEntry.driverId
                          )}
                        </td>

                        <td>
                          <strong>
                            {formatNumber(
                              fuelEntry.odometerReading
                            )}{" "}
                            км
                          </strong>
                        </td>

                        <td>
                          {formatNumber(
                            fuelEntry.liters
                          )}{" "}
                          л
                        </td>

                        <td>
                          {fuelEntry.distanceSinceLastRefuel ===
                            null ||
                          fuelEntry.distanceSinceLastRefuel ===
                            undefined
                            ? "—"
                            : `${formatNumber(fuelEntry.distanceSinceLastRefuel)} км`}
                        </td>

                        <td>
                          {fuelEntry.fuelConsumption ===
                            null ||
                          fuelEntry.fuelConsumption ===
                            undefined
                            ? "—"
                            : `${formatNumber(fuelEntry.fuelConsumption)} л / 100 км`}
                        </td>

                        <td>
                          <span
                            className={
                              fuelEntry.isFullTank
                                ? "vehicle-table-badge vehicle-table-badge--complete"
                                : "vehicle-table-badge vehicle-table-badge--neutral"
                            }
                          >
                            {fuelEntry.isFullTank
                              ? "Так"
                              : "Ні"}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={
                              `/admin/fuel/${fuelEntry.id}`
                            }
                            className="vehicle-table-arrow"
                            aria-label="Відкрити заправку"
                          >
                            <ChevronRight
                              size={19}
                            />
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          <VehicleDataPagination
            currentPage={
              fuelCurrentPage
            }
            totalPages={
              fuelTotalPages
            }
            onPageChange={
              onFuelPageChange
            }
          />
        </div>
      )}
    </section>
  );
}

export default VehicleDataPanel;