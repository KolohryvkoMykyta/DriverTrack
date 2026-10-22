import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Gauge,
  Route,
  Wallet,
} from "lucide-react";

import {
  getDriverDashboard,
  type DriverDashboard,
} from "../../api/driverApi";

import {
  getApiErrorMessage,
} from "../../api/apiErrorHandler";

export type DriverPeriod =
  | "all"
  | "month"
  | "week"
  | "custom";

type DriverResultsProps = {
  refreshKey: number;
  period: DriverPeriod;
  customFrom?: string;
  customTo?: string;
  showMetrics?: boolean;
  historyTitle?: string;
  showAllRoutes?: boolean;
  onShowAllRoutes?: () => void;
};

const PAGE_SIZE = 10;

const numberFormatter =
  new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 0,
  });

const moneyFormatter =
  new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 2,
  });

const dateFormatter =
  new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const timeFormatter =
  new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

function formatRoutePeriod(
  startDate: string,
  endDate: string
) {
  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const isSameDay =
    start.getFullYear() ===
      end.getFullYear() &&
    start.getMonth() ===
      end.getMonth() &&
    start.getDate() ===
      end.getDate();

  if (isSameDay) {
    return (
      `${dateFormatter.format(start)} · ` +
      `${timeFormatter.format(start)}–${timeFormatter.format(end)}`
    );
  }

  return (
    `${dateFormatter.format(start)} ${timeFormatter.format(start)}` +
    ` → ${dateFormatter.format(end)} ${timeFormatter.format(end)}`
  );
}

function getPeriodBounds(
  period: DriverPeriod,
  customFrom?: string,
  customTo?: string
) {
  const now =
    new Date();

  let from: Date;
  let to: Date;

  switch (period) {
    case "all":
      from =
        new Date(
          2000,
          0,
          1
        );

      to =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );

      break;

    case "week": {
      const daysSinceMonday =
        (now.getDay() + 6) % 7;

      from =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() -
            daysSinceMonday
        );

      to =
        new Date(
          from.getFullYear(),
          from.getMonth(),
          from.getDate() + 7
        );

      break;
    }

    case "custom":
      if (customFrom) {
        from =
          new Date(
            `${customFrom}T00:00:00`
          );
      } else {
        from =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );
      }

      if (customTo) {
        to =
          new Date(
            `${customTo}T00:00:00`
          );

        to.setDate(
          to.getDate() + 1
        );
      } else {
        to =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
          );
      }

      break;

    case "month":
    default:
      from =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

      to =
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );

      break;
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function DriverResults({
  refreshKey,
  period,
  customFrom,
  customTo,
  showMetrics = true,
  historyTitle = "Останні маршрути",
  showAllRoutes = false,
  onShowAllRoutes,
}: DriverResultsProps) {
  const [data, setData] =
    useState<DriverDashboard | null>(
      null
    );

  const [error, setError] =
    useState("");

  const [attempt, setAttempt] =
    useState(0);

  const [page, setPage] =
    useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { from, to } =
          getPeriodBounds(
            period,
            customFrom,
            customTo
          );

        const result =
          await getDriverDashboard(
            from,
            to
          );

        if (cancelled) {
          return;
        }

        setData(result);
        setError("");
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          getApiErrorMessage(error)
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    period,
    customFrom,
    customTo,
    refreshKey,
    attempt,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    period,
    customFrom,
    customTo,
    showAllRoutes,
  ]);

  function retry() {
    setError("");

    setAttempt(
      (value) => value + 1
    );
  }

  const displayedRoutes =
    useMemo(() => {
      if (!data) {
        return [];
      }

      return showAllRoutes
        ? data.recentRoutes
        : data.recentRoutes.slice(
            0,
            5
          );
    }, [
      data,
      showAllRoutes,
    ]);

  const totalPages =
    showAllRoutes
      ? Math.max(
          1,
          Math.ceil(
            displayedRoutes.length /
              PAGE_SIZE
          )
        )
      : 1;

  const paginatedRoutes =
    useMemo(() => {
      if (!showAllRoutes) {
        return displayedRoutes;
      }

      const startIndex =
        (page - 1) * PAGE_SIZE;

      return displayedRoutes.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );
    }, [
      displayedRoutes,
      page,
      showAllRoutes,
    ]);

  if (error) {
    return (
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
    );
  }

  if (!data) {
    return (
      <div
        className="driver-results__loading"
        role="status"
      >
        Завантаження результатів…
      </div>
    );
  }

  return (
    <section className="driver-results">
      {showMetrics && (
        <div className="driver-results__metrics">
          <div className="driver-metric">
            <span
              className="driver-metric__icon"
              aria-hidden="true"
            >
              <Route size={22} />
            </span>

            <div className="driver-metric__body">
              <span className="driver-metric__label">
                Завершено маршрутів
              </span>

              <strong className="driver-metric__value">
                {numberFormatter.format(
                  data.completedRouteCount
                )}
              </strong>
            </div>
          </div>

          <div className="driver-metric">
            <span
              className="driver-metric__icon"
              aria-hidden="true"
            >
              <Gauge size={22} />
            </span>

            <div className="driver-metric__body">
              <span className="driver-metric__label">
                Пробіг
              </span>

              <strong className="driver-metric__value">
                {numberFormatter.format(
                  data.totalDistance
                )}

                <span className="driver-metric__unit">
                  {" "}
                  км
                </span>
              </strong>
            </div>
          </div>

          <div className="driver-metric driver-metric--payment">
            <span
              className="driver-metric__icon"
              aria-hidden="true"
            >
              <Wallet size={22} />
            </span>

            <div className="driver-metric__body">
              <span className="driver-metric__label">
                Нарахована оплата
              </span>

              <strong className="driver-metric__value">
                {moneyFormatter.format(
                  data.totalDriverPayment
                )}

                <span className="driver-metric__unit">
                  {" "}
                  грн
                </span>
              </strong>
            </div>
          </div>
        </div>
      )}

      <section
        className="driver-history"
        aria-labelledby="driver-history-title"
      >
        <div className="driver-history__header">
          <h2 id="driver-history-title">
            {historyTitle}
          </h2>

          {!showAllRoutes &&
          data.recentRoutes.length > 5 &&
          onShowAllRoutes ? (
            <button
              type="button"
              className="driver-history__show-all"
              onClick={onShowAllRoutes}
            >
              Всі маршрути →
            </button>
          ) : (
            <span>
              Завершені за обраний період
            </span>
          )}
        </div>

        {paginatedRoutes.length === 0 ? (
          <p className="driver-history__empty">
            За цей період немає завершених маршрутів.
          </p>
        ) : (
          <>
            <ul className="driver-history__list">
              {paginatedRoutes.map(
                (route) => (
                  <li
                    key={route.id}
                    className="driver-history__row"
                  >
                    <div>
                      <strong className="driver-history__route-name">
                        {route.routeTypeName ||
                          "Маршрут"}
                      </strong>

                      <span className="driver-history__secondary">
                        {formatRoutePeriod(
                          route.startDate,
                          route.endDate
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="driver-history__vehicle-name">
                        {route.vehicleName ||
                          "Автомобіль"}
                      </span>

                      <span className="driver-history__secondary">
                        {
                          route.licensePlate
                        }
                      </span>
                    </div>

                    <span className="driver-history__distance">
                      {numberFormatter.format(
                        route.totalDistance
                      )}{" "}
                      км
                    </span>

                    <strong className="driver-history__payment">
                      {moneyFormatter.format(
                        route.driverPayment
                      )}{" "}
                      грн
                    </strong>
                  </li>
                )
              )}
            </ul>

            {showAllRoutes &&
              totalPages > 1 && (
                <div className="driver-pagination">
                  <button
                    type="button"
                    className="driver-pagination__button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    disabled={
                      page === 1
                    }
                  >
                    ← Назад
                  </button>

                  <div className="driver-pagination__pages">
                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (
                        pageNumber
                      ) => (
                        <button
                          key={
                            pageNumber
                          }
                          type="button"
                          className={`driver-pagination__page ${
                            page ===
                            pageNumber
                              ? "driver-pagination__page--active"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(
                              pageNumber
                            )
                          }
                        >
                          {
                            pageNumber
                          }
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="driver-pagination__button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                      )
                    }
                    disabled={
                      page ===
                      totalPages
                    }
                  >
                    Далі →
                  </button>
                </div>
              )}
          </>
        )}
      </section>
    </section>
  );
}

export default DriverResults;