export type VehiclePeriodMode =
  | "week"
  | "month"
  | "all"
  | "custom";

type VehicleDetailsFiltersProps = {
  periodMode: VehiclePeriodMode;
  from: string;
  to: string;
  isLoading: boolean;

  onPeriodModeChange: (
    mode: VehiclePeriodMode
  ) => void;

  onFromChange: (
    value: string
  ) => void;

  onToChange: (
    value: string
  ) => void;
};

const periodOptions: Array<{
  value: VehiclePeriodMode;
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

function VehicleDetailsFilters({
  periodMode,
  from,
  to,
  isLoading,
  onPeriodModeChange,
  onFromChange,
  onToChange,
}: VehicleDetailsFiltersProps) {
  return (
    <section className="vehicle-details-sidebar">
      <h3 className="vehicle-details-sidebar__title">
        Фільтри
      </h3>

      <div className="vehicle-details-sidebar__periods">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            className={
              periodMode === option.value
                ? "vehicle-details-sidebar__option vehicle-details-sidebar__option--active"
                : "vehicle-details-sidebar__option"
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
        <div className="vehicle-details-sidebar__dates">
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
    </section>
  );
}

export default VehicleDetailsFilters;