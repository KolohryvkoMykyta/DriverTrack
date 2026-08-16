import {
  useEffect,
  useState,
} from "react";

import type { Driver } from "../../../api/driversApi";
import type { Vehicle } from "../../../api/vehiclesApi";

import type { PeriodMode } from "./overviewTypes";

type OverviewFiltersProps = {
  drivers: Driver[];
  vehicles: Vehicle[];

  periodMode: PeriodMode;
  from: string;
  to: string;
  driverId: string;
  vehicleId: string;

  isLoading: boolean;
  hasActiveFilters: boolean;

  onPeriodModeChange: (mode: PeriodMode) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onDriverChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
  onReset: () => void;
};

const periodOptions: Array<{
  value: PeriodMode;
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

function OverviewFilters({
  drivers,
  vehicles,
  periodMode,
  from,
  to,
  driverId,
  vehicleId,
  isLoading,
  hasActiveFilters,
  onPeriodModeChange,
  onFromChange,
  onToChange,
  onDriverChange,
  onVehicleChange,
  onReset,
}: OverviewFiltersProps) {
  const [draftFrom, setDraftFrom] =
    useState(from);

  const [draftTo, setDraftTo] =
    useState(to);

  useEffect(() => {
    setDraftFrom(from);
  }, [from]);

  useEffect(() => {
    setDraftTo(to);
  }, [to]);

  return (
    <section className="overview-sidebar-filters">
      <h3 className="overview-sidebar-section__title">
        Фільтри
      </h3>

      <div className="overview-sidebar-filters__periods">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isLoading}
            className={
              periodMode === option.value
                ? "overview-sidebar-option overview-sidebar-option--active"
                : "overview-sidebar-option"
            }
            onClick={() =>
              onPeriodModeChange(option.value)
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {periodMode === "custom" && (
        <div className="overview-sidebar-filters__dates">
          <label>
            <span>З дати</span>

            <input
              type="date"
              value={draftFrom}
              onChange={(event) =>
                setDraftFrom(event.target.value)
              }
              onBlur={() =>
                onFromChange(draftFrom)
              }
            />
          </label>

          <label>
            <span>По дату</span>

            <input
              type="date"
              value={draftTo}
              onChange={(event) =>
                setDraftTo(event.target.value)
              }
              onBlur={() =>
                onToChange(draftTo)
              }
            />
          </label>
        </div>
      )}

      <div className="overview-sidebar-filters__selects">
        <select
          value={driverId}
          disabled={isLoading}
          aria-label="Фільтр за водієм"
          onChange={(event) =>
            onDriverChange(event.target.value)
          }
        >
          <option value="">
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

        <select
          value={vehicleId}
          disabled={isLoading}
          aria-label="Фільтр за автомобілем"
          onChange={(event) =>
            onVehicleChange(event.target.value)
          }
        >
          <option value="">
            Усі автомобілі
          </option>

          {vehicles.map((vehicle) => (
            <option
              key={vehicle.id}
              value={vehicle.id}
            >
              {vehicle.brand} {vehicle.model} —{" "}
              {vehicle.licensePlate}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          disabled={isLoading}
          className="overview-sidebar-filters__reset"
          onClick={onReset}
        >
          Очистити фільтри
        </button>
      )}
    </section>
  );
}

export default OverviewFilters;