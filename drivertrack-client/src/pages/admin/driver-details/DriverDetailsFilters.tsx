import type {
  Vehicle,
} from "../../../api/vehiclesApi";

export type DriverDetailsTab =
  | "vehicles"
  | "routes"
  | "fuel";

export type DriverPeriodMode =
  | "week"
  | "month"
  | "all"
  | "custom";

type DriverDetailsFiltersProps = {
  periodMode: DriverPeriodMode;
  from: string;
  to: string;

  vehicles: Vehicle[];
  selectedVehicleId: string;

  isLoading: boolean;

  onPeriodModeChange: (
    mode: DriverPeriodMode
  ) => void;

  onFromChange: (
    value: string
  ) => void;

  onToChange: (
    value: string
  ) => void;

  onVehicleChange: (
    value: string
  ) => void;
};

const periodOptions: Array<{
  value: DriverPeriodMode;
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

function DriverDetailsFilters({
  periodMode,
  from,
  to,
  vehicles,
  selectedVehicleId,
  isLoading,
  onPeriodModeChange,
  onFromChange,
  onToChange,
  onVehicleChange,
}: DriverDetailsFiltersProps) {
  return (
    <section className="driver-details-sidebar">
      <h3 className="driver-details-sidebar__title">
        Фільтри
      </h3>

      <div className="driver-details-sidebar__periods">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            className={
              periodMode === option.value
                ? "driver-details-sidebar__option driver-details-sidebar__option--active"
                : "driver-details-sidebar__option"
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
        <div className="driver-details-sidebar__dates">
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

      <div className="driver-details-sidebar__vehicle">
          <label htmlFor="driver-vehicle-filter">
            Автомобіль
          </label>

          <select
            id="driver-vehicle-filter"
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
      </div>
    </section>
  );
}

export default DriverDetailsFilters;