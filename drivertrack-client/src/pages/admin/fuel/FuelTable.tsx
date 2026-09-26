import type { KeyboardEvent } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Fuel,
} from "lucide-react";

import type { DriverListItem } from "../../../api/driversApi";
import type { FuelEntry } from "../../../api/fuelEntriesApi";
import type { Vehicle } from "../../../api/vehiclesApi";

type FuelTableProps = {
  entries: FuelEntry[];
  drivers: DriverListItem[];
  vehicles: Vehicle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onOpenEntry: (entry: FuelEntry) => void;
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

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function FuelTable({
  entries,
  drivers,
  vehicles,
  totalCount,
  currentPage,
  totalPages,
  onOpenEntry,
  onPageChange,
}: FuelTableProps) {
  const driverNames = new Map(
    drivers.map((driver) => [driver.id, driver.name])
  );
  const vehiclesById = new Map(
    vehicles.map((vehicle) => [vehicle.id, vehicle])
  );

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    entry: FuelEntry
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenEntry(entry);
    }
  }

  return (
    <section className="fuel-table-card">
      <div className="fuel-table-header">
        <div>
          <h2>Історія заправок</h2>
          <p>Заправки за обраними фільтрами</p>
        </div>
        <span>{totalCount}</span>
      </div>

      {totalCount === 0 ? (
        <div className="fuel-table-empty">
          <span>
            <Fuel size={24} />
          </span>
          <strong>Заправки не знайдено</strong>
          <p>Змініть вибрані фільтри.</p>
        </div>
      ) : (
        <div className="fuel-table-scroll">
          <table className="fuel-table">
            <thead>
              <tr>
                <th>Автомобіль</th>
                <th>Водій</th>
                <th>Дата</th>
                <th>Одометр</th>
                <th>Заправлено</th>
                <th>Відстань</th>
                <th>Витрата</th>
                <th>Повний бак</th>
                <th aria-label="Дії" />
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => {
                const vehicle = vehiclesById.get(entry.vehicleId);

                return (
                  <tr
                    key={entry.id}
                    tabIndex={0}
                    className="fuel-table__row"
                    aria-label="Відкрити деталі заправки"
                    onClick={() => onOpenEntry(entry)}
                    onKeyDown={(event) => handleRowKeyDown(event, entry)}
                  >
                    <td>
                      <span className="fuel-table__vehicle">
                        <strong>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : "Невідомий автомобіль"}
                        </strong>
                        <small>{vehicle?.licensePlate ?? "—"}</small>
                      </span>
                    </td>
                    <td>
                      {driverNames.get(entry.driverId) ?? "Невідомий водій"}
                    </td>
                    <td>{dateFormatter.format(new Date(entry.date))}</td>
                    <td>
                      <strong>{formatNumber(entry.odometerReading)} км</strong>
                    </td>
                    <td>
                      <strong>{formatNumber(entry.liters)} л</strong>
                    </td>
                    <td>
                      {entry.distanceSinceLastRefuel === null ||
                      entry.distanceSinceLastRefuel === undefined
                        ? "—"
                        : `${formatNumber(entry.distanceSinceLastRefuel)} км`}
                    </td>
                    <td>
                      {entry.fuelConsumption === null ||
                      entry.fuelConsumption === undefined
                        ? "—"
                        : `${formatNumber(entry.fuelConsumption)} л / 100 км`}
                    </td>
                    <td>
                      <span
                        className={
                          entry.isFullTank
                            ? "fuel-table__status fuel-table__status--full"
                            : "fuel-table__status fuel-table__status--partial"
                        }
                      >
                        {entry.isFullTank ? "Так" : "Ні"}
                      </span>
                    </td>
                    <td>
                      <ChevronRight className="fuel-table__arrow" size={19} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="fuel-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={17} />
            Назад
          </button>
          <span>
            Сторінка <strong>{currentPage}</strong> з {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Далі
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}

export default FuelTable;
