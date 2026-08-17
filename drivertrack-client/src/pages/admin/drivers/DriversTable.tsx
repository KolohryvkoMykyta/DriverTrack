import type { KeyboardEvent } from "react";

import type {
  DriverListItem,
} from "../../../api/driversApi";

type DriversTableProps = {
  drivers: DriverListItem[];
  emptyMessage: string;
  onOpenDriver: (
    driver: DriverListItem
  ) => void;
};

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "В";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatVehicleCount(count: number) {
  if (count === 0) {
    return "Не призначено";
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    lastDigit === 1 &&
    lastTwoDigits !== 11
  ) {
    return `${count} автомобіль`;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (
      lastTwoDigits < 12 ||
      lastTwoDigits > 14
    )
  ) {
    return `${count} автомобілі`;
  }

  return `${count} автомобілів`;
}

function DriversTable({
  drivers,
  emptyMessage,
  onOpenDriver,
}: DriversTableProps) {
  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    driver: DriverListItem
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      onOpenDriver(driver);
    }
  }

  return (
    <section className="drivers-table-card">
      <div className="drivers-table-card__scroll">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Водій</th>
              <th>Телефон</th>
              <th>Автомобілі</th>
              <th>Статус</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="drivers-table__row"
                tabIndex={0}
                aria-label={
                  `Відкрити деталі водія ${driver.name}`
                }
                onClick={() =>
                  onOpenDriver(driver)
                }
                onKeyDown={(event) =>
                  handleRowKeyDown(
                    event,
                    driver
                  )
                }
              >
                <td>
                  <span className="drivers-table__driver">
                    <span
                      className="drivers-table__avatar"
                      aria-hidden="true"
                    >
                      {getInitials(driver.name)}
                    </span>

                    <strong>
                      {driver.name}
                    </strong>
                  </span>
                </td>

                <td>
                  {driver.phoneNumber?.trim()
                    ? driver.phoneNumber
                    : "Не вказано"}
                </td>

                <td>
                  <span
                    className={
                      driver.vehicles.length === 0
                        ? "drivers-table__vehicles drivers-table__vehicles--empty"
                        : "drivers-table__vehicles"
                    }
                  >
                    {formatVehicleCount(
                      driver.vehicles.length
                    )}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      driver.isActive
                        ? "drivers-table__status drivers-table__status--active"
                        : "drivers-table__status drivers-table__status--inactive"
                    }
                  >
                    {driver.isActive
                      ? "Активний"
                      : "Неактивний"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drivers.length === 0 && (
        <div className="drivers-table-card__empty">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export default DriversTable;