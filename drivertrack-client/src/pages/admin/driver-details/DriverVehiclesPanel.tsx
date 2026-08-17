import { CarFront, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Vehicle } from "../../../api/vehiclesApi";

type DriverVehiclesPanelProps = {
  vehicles: Vehicle[];
};

function formatConsumption(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Немає даних";
  }

  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} л / 100 км`;
}

function DriverVehiclesPanel({
  vehicles,
}: DriverVehiclesPanelProps) {
  return (
    <div className="driver-vehicles-panel">
      <div className="driver-data-header">
        <div>
          <h2 className="driver-data-title">Призначені автомобілі</h2>

          <p className="driver-data-description">
            Автомобілі, закріплені за цим водієм
          </p>
        </div>

        <span className="driver-data-count">{vehicles.length}</span>
      </div>

      {vehicles.length === 0 ? (
        <div className="driver-data-empty">
          <div className="driver-data-empty__icon">
            <CarFront size={24} />
          </div>

          <strong>Автомобілі не призначені</strong>

          <p>
            За цим водієм поки не закріплено жодного автомобіля.
          </p>
        </div>
      ) : (
        <div className="driver-vehicles-list">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              to={`/admin/vehicles/${vehicle.id}`}
              className="driver-vehicle-row"
            >
              <div className="driver-vehicle-row__icon">
                <CarFront size={21} />
              </div>

              <div className="driver-vehicle-row__main">
                <strong className="driver-vehicle-row__name">
                  {vehicle.brand} {vehicle.model}
                </strong>

                <span className="driver-vehicle-row__plate">
                  {vehicle.licensePlate}
                </span>
              </div>

              <span
                className={
                  vehicle.isActive
                    ? "driver-vehicle-status driver-vehicle-status--active"
                    : "driver-vehicle-status driver-vehicle-status--inactive"
                }
              >
                <span className="driver-vehicle-status__dot" />

                {vehicle.isActive ? "Активний" : "Неактивний"}
              </span>

              <div className="driver-vehicle-row__consumption">
                <span>Середня витрата пального</span>

                <strong>
                  {formatConsumption(vehicle.averageFuelConsumption)}
                </strong>
              </div>

              <ChevronRight
                size={20}
                className="driver-vehicle-row__arrow"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverVehiclesPanel;