import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { AdminOverviewDto } from "../../../api/statisticsApi";

import OverviewPagination from "./OverviewPagination";
import { formatMoney } from "./overviewUtils";

type DriversOverviewTableProps = {
  drivers: AdminOverviewDto["drivers"];
};

const PAGE_SIZE = 5;

function DriversOverviewTable({
  drivers,
}: DriversOverviewTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(drivers.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [drivers]);

  const visibleDrivers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    return drivers.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [drivers, currentPage]);

  return (
    <section className="overview-details-card">
      <div className="overview-details-card__header">
        <h3 className="overview-details-card__title">
          Статистика по водіях
        </h3>
      </div>

      {drivers.length === 0 ? (
        <div className="overview-details-card__empty">
          Немає даних по водіях.
        </div>
      ) : (
        <>
          <div className="overview-table-wrapper">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>Водій</th>
                  <th>Маршрути</th>
                  <th>Дохід</th>
                  <th>Зарплата</th>
                  <th>Паливо</th>
                  <th>Прибуток</th>
                </tr>
              </thead>

              <tbody>
                {visibleDrivers.map((driver) => (
                  <tr key={driver.driverId}>
                    <td>
                      <span className="overview-table__primary">
                        {driver.driverName}
                      </span>
                    </td>

                    <td>{driver.routeCount}</td>

                    <td>
                      {formatMoney(driver.revenue)}
                    </td>

                    <td>
                      {formatMoney(
                        driver.driverPayment
                      )}
                    </td>

                    <td>
                      {formatMoney(driver.fuelCost)}
                    </td>

                    <td>
                      <span
                        className={
                          driver.netProfit >= 0
                            ? "overview-table__profit overview-table__profit--positive"
                            : "overview-table__profit overview-table__profit--negative"
                        }
                      >
                        {formatMoney(
                          driver.netProfit
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <OverviewPagination
            currentPage={currentPage}
            totalItems={drivers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}

export default DriversOverviewTable;