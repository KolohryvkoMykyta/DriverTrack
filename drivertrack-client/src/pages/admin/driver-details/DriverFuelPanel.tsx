import { ChevronRight, Fuel } from "lucide-react";
import { Link } from "react-router-dom";

import type { FuelEntry } from "../../../api/fuelEntriesApi";
import type { Vehicle } from "../../../api/vehiclesApi";
import DriverDataPagination from "./DriverDataPagination";

type DriverFuelPanelProps = {
  fuelEntries: FuelEntry[];
  vehicles: Vehicle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : numberFormatter.format(value);
}

function getVehicle(vehicles: Vehicle[], vehicleId: string) {
  return vehicles.find((item) => item.id === vehicleId);
}

function DriverFuelPanel({
  fuelEntries,
  vehicles,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: DriverFuelPanelProps) {
  return (
    <div className="driver-entries-panel">
      <div className="driver-data-header">
        <div>
          <h2 className="driver-data-title">Заправки</h2>
          <p className="driver-data-description">
            Заправки водія за обраними фільтрами
          </p>
        </div>

        <span className="driver-data-count">{totalCount}</span>
      </div>

      {totalCount === 0 ? (
        <div className="driver-entry-empty">
          <div className="driver-entry-empty__icon driver-entry-empty__icon--fuel">
            <Fuel size={24} />
          </div>
          <strong>Заправки не знайдено</strong>
          <p>Змініть період або обраний автомобіль.</p>
        </div>
      ) : (
        <div className="driver-fuel-table">
          <div className="driver-fuel-table__head" aria-hidden="true">
            <span>Автомобіль</span>
            <span>Дата</span>
            <span>Одометр</span>
            <span>Заправлено</span>
            <span>Відстань</span>
            <span>Витрата</span>
            <span>Повний бак</span>
          </div>

          {fuelEntries.map((fuelEntry) => {
            const vehicle = getVehicle(vehicles, fuelEntry.vehicleId);

            return (
              <Link
                key={fuelEntry.id}
                to={`/admin/fuel/${fuelEntry.id}`}
                className="driver-fuel-row"
              >
                <div className="driver-fuel-cell driver-fuel-cell--vehicle">
                  <strong>
                    {vehicle
                      ? `${vehicle.brand} ${vehicle.model}`
                      : "Невідомий автомобіль"}
                  </strong>
                  <small>{vehicle?.licensePlate ?? "—"}</small>
                </div>

                <span className="driver-fuel-cell driver-fuel-cell--date">
                  {dateFormatter.format(new Date(fuelEntry.date))}
                </span>

                <strong className="driver-fuel-cell driver-fuel-cell--odometer">
                  {formatNumber(fuelEntry.odometerReading)} км
                </strong>

                <strong className="driver-fuel-cell driver-fuel-cell--liters">
                  {formatNumber(fuelEntry.liters)} л
                </strong>

                <strong className="driver-fuel-cell driver-fuel-cell--distance">
                  {fuelEntry.distanceSinceLastRefuel === null ||
                  fuelEntry.distanceSinceLastRefuel === undefined
                    ? "—"
                    : `${formatNumber(fuelEntry.distanceSinceLastRefuel)} км`}
                </strong>

                <strong className="driver-fuel-cell driver-fuel-cell--consumption">
                  {fuelEntry.fuelConsumption === null ||
                  fuelEntry.fuelConsumption === undefined
                    ? "—"
                    : `${formatNumber(fuelEntry.fuelConsumption)} л / 100 км`}
                </strong>

                <span
                  className={
                    fuelEntry.isFullTank
                      ? "driver-entry-badge driver-entry-badge--complete driver-fuel-cell--full-tank"
                      : "driver-entry-badge driver-entry-badge--neutral driver-fuel-cell--full-tank"
                  }
                >
                  {fuelEntry.isFullTank ? "Так" : "Ні"}
                </span>

                <ChevronRight className="driver-fuel-row__arrow" size={19} />
              </Link>
            );
          })}
        </div>
      )}

      <DriverDataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default DriverFuelPanel;