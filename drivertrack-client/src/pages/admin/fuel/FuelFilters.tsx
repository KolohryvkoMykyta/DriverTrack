import type { DriverListItem } from "../../../api/driversApi";
import type { Vehicle } from "../../../api/vehiclesApi";

export type FuelPeriodMode = "week" | "month" | "all" | "custom";

type FuelFiltersProps = {
  periodMode: FuelPeriodMode;
  from: string;
  to: string;
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  selectedDriverId: string;
  selectedVehicleId: string;
  isLoading: boolean;
  onPeriodModeChange: (mode: FuelPeriodMode) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onDriverChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
};

const periodOptions: Array<{ value: FuelPeriodMode; label: string }> = [
  { value: "week", label: "Поточний тиждень" },
  { value: "month", label: "Поточний місяць" },
  { value: "all", label: "Увесь час" },
  { value: "custom", label: "Власний період" },
];

function FuelFilters({
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
}: FuelFiltersProps) {
  return (
    <section className="fuel-sidebar">
      <h3 className="fuel-sidebar__title">Фільтри</h3>

      <div className="fuel-sidebar__periods">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            className={
              periodMode === option.value
                ? "fuel-sidebar__option fuel-sidebar__option--active"
                : "fuel-sidebar__option"
            }
            onClick={() => onPeriodModeChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {periodMode === "custom" && (
        <div className="fuel-sidebar__dates">
          <label>
            <span>З дати</span>
            <input
              type="date"
              value={from}
              onChange={(event) => onFromChange(event.target.value)}
            />
          </label>
          <label>
            <span>По дату</span>
            <input
              type="date"
              value={to}
              onChange={(event) => onToChange(event.target.value)}
            />
          </label>
        </div>
      )}

      <div className="fuel-sidebar__selects">
        <label>
          <span>Водій</span>
          <select
            value={selectedDriverId}
            disabled={isLoading}
            onChange={(event) => onDriverChange(event.target.value)}
          >
            <option value="all">Усі водії</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
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
            onChange={(event) => onVehicleChange(event.target.value)}
          >
            <option value="all">Усі автомобілі</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} — {vehicle.licensePlate}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default FuelFilters;
