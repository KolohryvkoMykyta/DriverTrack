import type {
  DriverListItem,
} from "../../../api/driversApi";

import type {
  Vehicle,
} from "../../../api/vehiclesApi";

export type RoutesPeriodMode =
  | "week"
  | "month"
  | "all"
  | "custom";

type RoutesFiltersProps = {
  periodMode: RoutesPeriodMode;
  from: string;
  to: string;
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  selectedDriverId: string;
  selectedVehicleId: string;
  isLoading: boolean;

  onPeriodModeChange: (
    mode: RoutesPeriodMode
  ) => void;

  onFromChange: (
    value: string
  ) => void;

  onToChange: (
    value: string
  ) => void;

  onDriverChange: (
    value: string
  ) => void;

  onVehicleChange: (
    value: string
  ) => void;
};

const periodOptions: Array<{
  value: RoutesPeriodMode;
  label: string;
}> = [
  {
    value: "week",
    label: "Поточний тиждень",
  },
  {
    value: "month",
    label: "Поточний місяць",
  },
  {
    value: "all",
    label: "Увесь час",
  },
  {
    value: "custom",
    label: "Власний період",
  },
];

function RoutesFilters({
  periodMode,
  from,
  to,
  drivers,
  vehicles,
  selectedDriverId,
  selectedVehicleId,
  isLoading,
  onPeriodModeChange,
  onFromChange,
  onToChange,
  onDriverChange,
  onVehicleChange,
}: RoutesFiltersProps) {
  return (
    <section className="routes-sidebar">
      <h3 className="routes-sidebar__title">
        Фільтри
      </h3>

      <div className="routes-sidebar__periods">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            className={
              periodMode === option.value
                ? "routes-sidebar__option routes-sidebar__option--active"
                : "routes-sidebar__option"
            }
            onClick={() =>
              onPeriodModeChange(
                option.value
              )
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {periodMode === "custom" && (
        <div className="routes-sidebar__dates">
          <label>
            <span>З дати</span>

            <input
              type="date"
              value={from}
              onChange={(event) =>
                onFromChange(
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>По дату</span>

            <input
              type="date"
              value={to}
              onChange={(event) =>
                onToChange(
                  event.target.value
                )
              }
            />
          </label>
        </div>
      )}

      <div className="routes-sidebar__selects">
        <label>
          <span>Водій</span>

          <select
            value={selectedDriverId}
            disabled={isLoading}
            onChange={(event) =>
              onDriverChange(
                event.target.value
              )
            }
          >
            <option value="all">
              Усі водії
            </option>

            {drivers.map((driver) => (
              <option
                key={driver.id}
                value={driver.id}
              >
                {driver.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Автомобіль</span>

          <select
            value={selectedVehicleId}
            disabled={isLoading}
            onChange={(event) =>
              onVehicleChange(
                event.target.value
              )
            }
          >
            <option value="all">
              Усі автомобілі
            </option>

            {vehicles.map((vehicle) => (
              <option
                key={vehicle.id}
                value={vehicle.id}
              >
                {vehicle.brand}{" "}
                {vehicle.model} —{" "}
                {vehicle.licensePlate}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default RoutesFilters;