import {
  ChevronLeft,
  ChevronRight,
  MapPinned,
  Pencil,
  Trash2,
} from "lucide-react";

import type { RouteType } from "../../../api/routeTypesApi";

type RouteTypesTableProps = {
  routeTypes: RouteType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  onEdit: (routeType: RouteType) => void;
  onDelete: (routeType: RouteType) => void;
  onPageChange: (page: number) => void;
};

const moneyFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return `${moneyFormatter.format(value)} грн`;
}

function RouteTypesTable({
  routeTypes,
  totalCount,
  currentPage,
  totalPages,
  searchQuery,
  onEdit,
  onDelete,
  onPageChange,
}: RouteTypesTableProps) {
  return (
    <section className="route-types-table-card">
      <div className="route-types-table-header">
        <div>
          <h2>Список типів</h2>
          <p>Фінансові умови для створення маршрутів</p>
        </div>
        <span>{totalCount}</span>
      </div>

      {totalCount === 0 ? (
        <div className="route-types-table-empty">
          <span>
            <MapPinned size={24} />
          </span>
          <strong>
            {searchQuery.trim()
              ? "Типи маршрутів не знайдено"
              : "Типів маршрутів поки немає"}
          </strong>
          <p>
            {searchQuery.trim()
              ? "Змініть пошуковий запит."
              : "Додайте перший тип маршруту."}
          </p>
        </div>
      ) : (
        <div className="route-types-table-scroll">
          <table className="route-types-table">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Дохід</th>
                <th>Водію</th>
                <th>Залишок до пального</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {routeTypes.map((routeType) => {
                const remainder =
                  routeType.revenue - routeType.driverPayment;

                return (
                  <tr key={routeType.id}>
                    <td>
                      <span className="route-types-table__name">
                        <span aria-hidden="true">
                          <MapPinned size={19} />
                        </span>
                        <strong>{routeType.name}</strong>
                      </span>
                    </td>
                    <td>
                      <strong>{formatMoney(routeType.revenue)}</strong>
                    </td>
                    <td>{formatMoney(routeType.driverPayment)}</td>
                    <td>
                      <span
                        className={
                          remainder >= 0
                            ? "route-types-table__remainder"
                            : "route-types-table__remainder route-types-table__remainder--negative"
                        }
                      >
                        {formatMoney(remainder)}
                      </span>
                    </td>
                    <td>
                      <span className="route-types-table__actions">
                        <button
                          type="button"
                          className="route-types-table__action route-types-table__action--edit"
                          aria-label={`Редагувати ${routeType.name}`}
                          onClick={() => onEdit(routeType)}
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          className="route-types-table__action route-types-table__action--delete"
                          aria-label={`Видалити ${routeType.name}`}
                          onClick={() => onDelete(routeType)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="route-types-pagination">
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

export default RouteTypesTable;
