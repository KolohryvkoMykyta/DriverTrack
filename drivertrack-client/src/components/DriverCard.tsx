import type { Driver } from "../api/driversApi";

type DriverCardProps = {
  driver: Driver;
  onClick: (driver: Driver) => void;
};

function DriverCard({ driver, onClick }: DriverCardProps) {
  return (
    <div
      onClick={() => onClick(driver)}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "8px",
        cursor: "pointer",
      }}
    >
      <strong>{driver.name}</strong>

      <p>
        Телефон:{" "}
        {driver.phoneNumber?.trim()
          ? driver.phoneNumber
          : "Не вказано"}
      </p>

      <p>
        Статус:{" "}
        {driver.isActive
          ? "Активний"
          : "Неактивний"}
      </p>
    </div>
  );
}

export default DriverCard;