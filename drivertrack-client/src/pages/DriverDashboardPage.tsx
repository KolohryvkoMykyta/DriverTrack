import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CarFront,
  Route as RouteIcon,
} from "lucide-react";

import {
  getDriverRouteTypes,
  getDriverVehicles,
  getOpenDriverRoute,
  type DriverRouteType,
  type DriverVehicle,
  type OpenDriverRoute,
} from "../api/driverApi";

import { getApiErrorMessage } from "../api/apiErrorHandler";
import { useDriverUser } from "../hooks/useDriverUser";
import DriverFuelResults from "./driver/DriverFuelResults";
import DriverRouteModal from "./driver/DriverRouteModal";

import DriverResults, {
  type DriverPeriod,
} from "./driver/DriverResults";

type DashboardData = {
  vehicles: DriverVehicle[];
  routeTypes: DriverRouteType[];
  openRoute: OpenDriverRoute | null;
};

type DriverTab =
  | "overview"
  | "routes"
  | "fuel"
  | "vehicles";

const numberFormatter =
  new Intl.NumberFormat("uk-UA");

const dateFormatter =
  new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const tabs: Array<{
  id: DriverTab;
  label: string;
}> = [
  {
    id: "overview",
    label: "Огляд",
  },
  {
    id: "routes",
    label: "Маршрути",
  },
  {
    id: "fuel",
    label: "Заправки",
  },
  {
    id: "vehicles",
    label: "Автомобілі",
  },
];

function DriverDashboardPage() {
  const currentUser =
    useDriverUser();

  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const [error, setError] =
    useState("");

  const [attempt, setAttempt] =
    useState(0);

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<DriverTab>(
      "overview"
    );

  const [period, setPeriod] =
    useState<DriverPeriod>("all");

  const [
    customFrom,
    setCustomFrom,
  ] = useState("");

  const [
    customTo,
    setCustomTo,
  ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          vehicles,
          routeTypes,
          openRoute,
        ] = await Promise.all([
          getDriverVehicles(),
          getDriverRouteTypes(),
          getOpenDriverRoute(),
        ]);

        if (cancelled) {
          return;
        }

        setData({
          vehicles,
          routeTypes,
          openRoute,
        });

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
  }, [attempt]);

  function reload() {
    setData(null);
    setError("");

    setAttempt(
      (value) => value + 1
    );
  }

  function handleSaved() {
    setMessage(
      data?.openRoute
        ? "Маршрут успішно завершено."
        : "Маршрут успішно відкрито."
    );

    setIsModalOpen(false);

    reload();
  }

  const route =
    data?.openRoute;

  const currentVehicle =
    useMemo(() => {
      if (!data) {
        return null;
      }

      if (route) {
        return (
          data.vehicles.find(
            (item) =>
              item.id ===
              route.vehicleId
          ) ?? null
        );
      }

      return (
        data.vehicles[0] ?? null
      );
    }, [data, route]);

  const routeType =
    data?.routeTypes.find(
      (item) =>
        item.id ===
        route?.routeTypeId
    );

  const canOpenRoute =
    !!data &&
    data.vehicles.length > 0 &&
    data.routeTypes.length > 0;

  return (
    <div className="driver-dashboard">
      <section className="driver-dashboard__profile">
        <div>
          <p className="driver-dashboard__eyebrow">
            Кабінет водія
          </p>

          <h1>
            {currentUser.displayName}
          </h1>

          <p className="driver-dashboard__email">
            {currentUser.email}
          </p>
        </div>
      </section>

      <div className="driver-dashboard__toolbar">
        <nav
          className="driver-tabs"
          aria-label="Розділи кабінету водія"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`driver-tabs__item ${
                activeTab === tab.id
                  ? "driver-tabs__item--active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="driver-period-wrapper">
          <label className="driver-period">
            <CalendarDays
              size={17}
              aria-hidden="true"
            />

            <span className="sr-only">
              Період
            </span>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target
                    .value as DriverPeriod
                )
              }
              aria-label="Період результатів"
            >
              <option value="all">
                Весь час
              </option>

              <option value="month">
                Поточний місяць
              </option>

              <option value="week">
                Поточний тиждень
              </option>

              <option value="custom">
                Власний період
              </option>
            </select>
          </label>

          {period === "custom" && (
            <div className="driver-custom-period">
              <input
                type="date"
                value={customFrom}
                onChange={(event) =>
                  setCustomFrom(
                    event.target.value
                  )
                }
                aria-label="Початкова дата"
              />

              <span>—</span>

              <input
                type="date"
                value={customTo}
                onChange={(event) =>
                  setCustomTo(
                    event.target.value
                  )
                }
                aria-label="Кінцева дата"
              />
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          className="driver-success"
          role="status"
        >
          {message}
        </div>
      )}

      {error ? (
        <div
          className="driver-feedback"
          role="alert"
        >
          <p>{error}</p>

          <button
            type="button"
            className="driver-button"
            onClick={reload}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : !data ? (
        <div
          className="driver-panel"
          role="status"
        >
          Завантаження даних…
        </div>
      ) : (
        <>
          {activeTab ===
            "overview" && (
            <>
              <div className="driver-overview-grid">
                <section
                  className="driver-route-card"
                  aria-labelledby="current-route-title"
                >
                  <div className="driver-route-card__header">
                    <span className="driver-route-card__section-title">
                      <RouteIcon
                        size={18}
                        aria-hidden="true"
                      />

                      Поточний маршрут
                    </span>

                    <span className="driver-route-card__status">
                      {route
                        ? "У дорозі"
                        : "Немає відкритого маршруту"}
                    </span>
                  </div>

                  <div className="driver-route-card__body">
                    <div>
                      <h2 id="current-route-title">
                        {route
                          ? routeType?.name ||
                            "Відкритий маршрут"
                          : "Готові вирушати?"}
                      </h2>

                      <p className="driver-route-card__description">
                        {route
                          ? "Після поїздки внесіть кінцеві показання одометра."
                          : "Оберіть маршрут і внесіть початкові показання."}
                      </p>
                    </div>

                    {(route ||
                      canOpenRoute) && (
                      <button
                        type="button"
                        className="driver-button"
                        onClick={() =>
                          setIsModalOpen(
                            true
                          )
                        }
                      >
                        {route
                          ? "Завершити маршрут"
                          : "Розпочати маршрут"}
                      </button>
                    )}
                  </div>

                  {route && (
                    <dl className="driver-route-card__details">
                      <div>
                        <dt>
                          Автомобіль
                        </dt>

                        <dd>
                          {currentVehicle
                            ? `${currentVehicle.brand} ${currentVehicle.model}`
                            : "Автомобіль недоступний"}

                          {currentVehicle && (
                            <span className="driver-route-card__plate">
                              {
                                currentVehicle.licensePlate
                              }
                            </span>
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Початок
                        </dt>

                        <dd>
                          {dateFormatter.format(
                            new Date(
                              route.startDate
                            )
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Початковий одометр
                        </dt>

                        <dd>
                          {numberFormatter.format(
                            route.startOdometer
                          )}{" "}
                          км
                        </dd>
                      </div>
                    </dl>
                  )}

                  {!route &&
                    data.vehicles.length ===
                      0 && (
                      <p className="driver-route-card__notice">
                        Вам ще не
                        призначено активний
                        автомобіль.
                        Зверніться до
                        адміністратора.
                      </p>
                    )}

                  {!route &&
                    data.routeTypes
                      .length === 0 && (
                      <p className="driver-route-card__notice">
                        Немає доступних
                        типів маршрутів.
                        Зверніться до
                        адміністратора.
                      </p>
                    )}
                </section>

                <section className="driver-current-vehicle">
                  <div className="driver-current-vehicle__title">
                    <CarFront
                      size={18}
                      aria-hidden="true"
                    />

                    <h2>
                      Поточний автомобіль
                    </h2>
                  </div>

                  {currentVehicle ? (
                    <>
                      <div className="driver-current-vehicle__name">
                        <strong>
                          {
                            currentVehicle.brand
                          }{" "}
                          {
                            currentVehicle.model
                          }
                        </strong>

                        <span>
                          {
                            currentVehicle.licensePlate
                          }
                        </span>
                      </div>

                      <dl className="driver-current-vehicle__details">
                        <div>
                          <dt>
                            Середня витрата
                          </dt>

                          <dd>
                            {currentVehicle.averageFuelConsumption !=
                            null
                              ? `${numberFormatter.format(
                                  currentVehicle.averageFuelConsumption
                                )} л/100 км`
                              : "Не вказано"}
                          </dd>
                        </div>
                      </dl>
                    </>
                  ) : (
                    <p className="driver-empty-copy">
                      Немає призначеного
                      автомобіля.
                    </p>
                  )}
                </section>
              </div>

              <DriverResults
                refreshKey={attempt}
                period={period}
                customFrom={customFrom}
                customTo={customTo}
                onShowAllRoutes={() =>
                  setActiveTab(
                    "routes"
                  )
                }
              />
            </>
          )}

          {activeTab ===
            "routes" && (
            <DriverResults
              refreshKey={attempt}
              period={period}
              customFrom={customFrom}
              customTo={customTo}
              showMetrics={false}
              historyTitle="Маршрути"
              showAllRoutes
            />
          )}

          {activeTab === "fuel" && (
            <DriverFuelResults
              period={period}
              customFrom={customFrom}
              customTo={customTo}
              vehicles={data.vehicles}
            />
          )}

          {activeTab ===
            "vehicles" && (
            <section className="driver-vehicles-panel">
              <div className="driver-panel__header">
                <div>
                  <h2>
                    Мої автомобілі
                  </h2>

                  <p>
                    Автомобілі,
                    доступні для ваших
                    маршрутів.
                  </p>
                </div>
              </div>

              {data.vehicles.length ===
              0 ? (
                <p className="driver-empty-copy">
                  Вам ще не призначено
                  автомобіль.
                </p>
              ) : (
                <div className="driver-vehicle-list">
                  {data.vehicles.map(
                    (vehicle) => (
                      <article
                        key={vehicle.id}
                        className="driver-vehicle-card"
                      >
                        <span
                          className="driver-vehicle-card__icon"
                          aria-hidden="true"
                        >
                          <CarFront
                            size={22}
                          />
                        </span>

                        <div>
                          <h3>
                            {
                              vehicle.brand
                            }{" "}
                            {
                              vehicle.model
                            }
                          </h3>

                          <p>
                            {
                              vehicle.licensePlate
                            }
                          </p>
                        </div>

                        <span className="driver-vehicle-card__consumption">
                          {vehicle.averageFuelConsumption !=
                          null
                            ? `${numberFormatter.format(
                                vehicle.averageFuelConsumption
                              )} л/100 км`
                            : "Витрату не вказано"}
                        </span>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {isModalOpen && data && (
        <DriverRouteModal
          route={data.openRoute}
          vehicles={data.vehicles}
          routeTypes={data.routeTypes}
          onClose={() =>
            setIsModalOpen(false)
          }
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default DriverDashboardPage;