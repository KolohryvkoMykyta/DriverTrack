import type { KeyboardEvent } from "react";

import { Car } from "lucide-react";

import type {
  DriverListItem,
} from "../../../api/driversApi";

import type {
  Vehicle,
} from "../../../api/vehiclesApi";

type VehiclesTableProps = {
  vehicles: Vehicle[];
  drivers: DriverListItem[];
  emptyMessage: string;
  onOpenVehicle: (
    vehicle: Vehicle
  ) => void;
};

function formatAverageConsumption(
  value: number | null
) {
  if (value === null) {
    return "Немає даних";
  }

  return `${value} л / 100 км`;
}

function VehiclesTable({
  vehicles,
  drivers,
  emptyMessage,
  onOpenVehicle,
}: VehiclesTableProps) {
  const driverNames = new Map(
    drivers.map((driver) => [
      driver.id,
      driver.name,
    ])
  );

  function getDriverName(
    driverId: string | null
  ) {
    if (!driverId) {
      return "Не призначено";
    }

    return driverNames.get(driverId) ??
      "Невідомий водій";
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    vehicle: Vehicle
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      onOpenVehicle(vehicle);
    }
  }

  return (
    <section className="vehicles-table-card">
      <div className="vehicles-table-card__scroll">
        <table className="vehicles-table">
          <thead>
            <tr>
              <th>Автомобіль</th>
              <th>Державний номер</th>
              <th>Водій</th>
              <th>Середня витрата</th>
              <th>Статус</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => {
              const driverName = getDriverName(
                vehicle.driverId
              );

              return (
                <tr
                  key={vehicle.id}
                  className="vehicles-table__row"
                  tabIndex={0}
                  aria-label={
                    `Відкрити деталі автомобіля ${vehicle.brand} ${vehicle.model}`
                  }
                  onClick={() =>
                    onOpenVehicle(vehicle)
                  }
                  onKeyDown={(event) =>
                    handleRowKeyDown(
                      event,
                      vehicle
                    )
                  }
                >
                  <td>
                    <span className="vehicles-table__vehicle">
                      <span
                        className="vehicles-table__icon"
                        aria-hidden="true"
                      >
                        <Car
                          size={20}
                          strokeWidth={2}
                        />
                      </span>

                      <strong>
                        {vehicle.brand}{" "}
                        {vehicle.model}
                      </strong>
                    </span>
                  </td>

                  <td>
                    <span className="vehicles-table__plate">
                      {vehicle.licensePlate}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        vehicle.driverId
                          ? "vehicles-table__driver"
                          : "vehicles-table__driver vehicles-table__driver--empty"
                      }
                    >
                      {driverName}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        vehicle.averageFuelConsumption === null
                          ? "vehicles-table__consumption vehicles-table__consumption--empty"
                          : "vehicles-table__consumption"
                      }
                    >
                      {formatAverageConsumption(
                        vehicle.averageFuelConsumption
                      )}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        vehicle.isActive
                          ? "vehicles-table__status vehicles-table__status--active"
                          : "vehicles-table__status vehicles-table__status--inactive"
                      }
                    >
                      {vehicle.isActive
                        ? "Активний"
                        : "Неактивний"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {vehicles.length === 0 && (
        <div className="vehicles-table-card__empty">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export default VehiclesTable;