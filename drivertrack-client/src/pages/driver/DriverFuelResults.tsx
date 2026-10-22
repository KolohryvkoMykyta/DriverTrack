import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Fuel,
} from "lucide-react";

import {
  getDriverFuelEntries,
  type DriverFuelEntry,
  type DriverVehicle,
} from "../../api/driverApi";

import {
  getApiErrorMessage,
} from "../../api/apiErrorHandler";

import type {
  DriverPeriod,
} from "./DriverResults";

type DriverFuelResultsProps = {
  period: DriverPeriod;
  customFrom?: string;
  customTo?: string;
  vehicles: DriverVehicle[];
};

const PAGE_SIZE = 10;

const numberFormatter =
  new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 2,
  });

const dateFormatter =
  new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function getPeriodBounds(
  period: DriverPeriod,
  customFrom?: string,
  customTo?: string
) {
  const now = new Date();

  let from: Date;
  let to: Date;

  switch (period) {
    case "all":
      from = new Date(
        2000,
        0,
        1
      );

      to = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      break;

    case "week": {
      const daysSinceMonday =
        (now.getDay() + 6) % 7;

      from = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() -
          daysSinceMonday
      );

      to = new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate() + 7
      );

      break;
    }

    case "custom":
      if (customFrom) {
        from = new Date(
          `${customFrom}T00:00:00`
        );
      } else {
        from = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
      }

      if (customTo) {
        to = new Date(
          `${customTo}T23:59:59.999`
        );
      } else {
        to = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
      }

      break;

    case "month":
    default:
      from = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      to = new Date(
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

function DriverFuelResults({
  period,
  customFrom,
  customTo,
  vehicles,
}: DriverFuelResultsProps) {
  const [
    entries,
    setEntries,
  ] = useState<DriverFuelEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

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
        setLoading(true);

        const { from, to } =
          getPeriodBounds(
            period,
            customFrom,
            customTo
          );

        const result =
          await getDriverFuelEntries(
            from,
            to
          );

        if (cancelled) {
          return;
        }

        setEntries(result);
        setError("");
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          getApiErrorMessage(error)
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
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
    attempt,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    period,
    customFrom,
    customTo,
  ]);

  const vehicleMap =
    useMemo(
      () =>
        new Map(
          vehicles.map(
            (vehicle) => [
              vehicle.id,
              vehicle,
            ]
          )
        ),
      [vehicles]
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        entries.length /
          PAGE_SIZE
      )
    );

  const paginatedEntries =
    useMemo(() => {
      const startIndex =
        (page - 1) *
        PAGE_SIZE;

      return entries.slice(
        startIndex,
        startIndex +
          PAGE_SIZE
      );
    }, [
      entries,
      page,
    ]);

  function retry() {
    setError("");

    setAttempt(
      (value) => value + 1
    );
  }

  if (loading) {
    return (
      <div
        className="driver-results__loading"
        role="status"
      >
        Завантаження заправок…
      </div>
    );
  }

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

  return (
    <section className="driver-results">
      <section className="driver-history">
        <div className="driver-history__header">
          <div className="driver-fuel-title">
            <Fuel
              size={18}
              aria-hidden="true"
            />

            <h2>
              Заправки
            </h2>
          </div>

          <span>
            {entries.length === 0
              ? "Немає записів"
              : `${entries.length} записів`}
          </span>
        </div>

        {entries.length === 0 ? (
          <p className="driver-history__empty">
            За обраний період
            заправок немає.
          </p>
        ) : (
          <>
            <div className="driver-fuel-table">
              <div className="driver-fuel-table__head">
                <span>
                  Дата
                </span>

                <span>
                  Автомобіль
                </span>

                <span>
                  Одометр
                </span>

                <span>
                  Пальне
                </span>

                <span>
                  Пробіг
                </span>

                <span>
                  Витрата
                </span>
              </div>

              <div className="driver-fuel-table__body">
                {paginatedEntries.map(
                  (entry) => {
                    const vehicle =
                      vehicleMap.get(
                        entry.vehicleId
                      );

                    return (
                      <article
                        key={entry.id}
                        className="driver-fuel-table__row"
                      >
                        <div>
                          <strong>
                            {dateFormatter.format(
                              new Date(
                                entry.date
                              )
                            )}
                          </strong>
                        </div>

                        <div>
                          <strong>
                            {vehicle
                              ? `${vehicle.brand} ${vehicle.model}`
                              : "Автомобіль"}
                          </strong>

                          {vehicle && (
                            <span className="driver-history__secondary">
                              {
                                vehicle.licensePlate
                              }
                            </span>
                          )}
                        </div>

                        <span>
                          {numberFormatter.format(
                            entry.odometerReading
                          )}{" "}
                          км
                        </span>

                        <div>
                          <strong>
                            {numberFormatter.format(
                              entry.liters
                            )}{" "}
                            л
                          </strong>

                          <span
                            className={`driver-fuel-full ${
                              entry.isFullTank
                                ? "driver-fuel-full--yes"
                                : ""
                            }`}
                          >
                            {entry.isFullTank
                              ? "Повний бак"
                              : "Часткова"}
                          </span>
                        </div>

                        <span>
                          {entry.distanceSinceLastRefuel ==
                          null
                            ? "—"
                            : `${numberFormatter.format(
                                entry.distanceSinceLastRefuel
                              )} км`}
                        </span>

                        <strong className="driver-fuel-consumption">
                          {entry.fuelConsumption ==
                          null
                            ? "—"
                            : `${numberFormatter.format(
                                entry.fuelConsumption
                              )} л/100 км`}
                        </strong>
                      </article>
                    );
                  }
                )}
              </div>
            </div>

            {totalPages >
              1 && (
              <div className="driver-pagination">
                <button
                  type="button"
                  className="driver-pagination__button"
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current -
                            1
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
                          current +
                            1
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

export default DriverFuelResults;