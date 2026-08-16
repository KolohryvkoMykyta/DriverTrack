import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { AdminOverviewDto } from "../../../api/statisticsApi";

import OverviewPagination from "./OverviewPagination";
import { formatNumber } from "./overviewUtils";

type VehiclesOverviewTableProps = {
  vehicles: AdminOverviewDto["vehicles"];
};

const PAGE_SIZE = 5;

function VehiclesOverviewTable({
  vehicles,
}: VehiclesOverviewTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(vehicles.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [vehicles]);

  const visibleVehicles = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    return vehicles.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [vehicles, currentPage]);

  return (
    <section className="overview-details-card">
      <div className="overview-details-card__header">
        <h3 className="overview-details-card__title">
          Статистика по автомобілях
        </h3>
      </div>

      {vehicles.length === 0 ? (
        <div className="overview-details-card__empty">
          Немає даних по автомобілях.
        </div>
      ) : (
        <>
          <div className="overview-table-wrapper">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>Автомобіль</th>
                  <th>Номер</th>
                  <th>Маршрути</th>
                  <th>Пробіг</th>
                  <th>Паливо</th>
                  <th>Середня витрата</th>
                </tr>
              </thead>

              <tbody>
                {visibleVehicles.map(
                  (vehicle) => (
                    <tr key={vehicle.vehicleId}>
                      <td>
                        <span className="overview-table__primary">
                          {vehicle.vehicleName}
                        </span>
                      </td>

                      <td>
                        {vehicle.licensePlate}
                      </td>

                      <td>
                        {vehicle.routeCount}
                      </td>

                      <td>
                        {formatNumber(
                          vehicle.totalDistance
                        )}{" "}
                        км
                      </td>

                      <td>
                        {formatNumber(
                          vehicle.totalFuelLiters
                        )}{" "}
                        л
                      </td>

                      <td>
                        {vehicle.averageFuelConsumption ===
                        null
                          ? "Немає даних"
                          : `${vehicle.averageFuelConsumption} л / 100 км`}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <OverviewPagination
            currentPage={currentPage}
            totalItems={vehicles.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}

export default VehiclesOverviewTable;