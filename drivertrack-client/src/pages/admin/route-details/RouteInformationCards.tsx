import type { RouteDetails } from "../../../api/routeEntriesApi";

type RouteInformationCardsProps = {
  route: RouteDetails;
  routeTypeName: string;
  driverName: string;
  vehicleName: string;
  licensePlate: string;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatDateTime(value: string | null) {
  if (!value) {
    return "Не завершено";
  }

  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: number | null) {
  return value === null
    ? "Немає даних"
    : `${numberFormatter.format(value)} грн`;
}

function RouteInformationCards({
  route,
  routeTypeName,
  driverName,
  vehicleName,
  licensePlate,
}: RouteInformationCardsProps) {
  const details = [
    ["Тип маршруту", routeTypeName],
    ["Водій", driverName],
    ["Автомобіль", vehicleName],
    ["Номер автомобіля", licensePlate],
    ["Початок маршруту", formatDateTime(route.startDate)],
    ["Завершення маршруту", formatDateTime(route.endDate)],
    [
      "Початковий одометр",
      `${numberFormatter.format(route.startOdometer)} км`,
    ],
    [
      "Кінцевий одометр",
      route.endOdometer === null
        ? "Немає даних"
        : `${numberFormatter.format(route.endOdometer)} км`,
    ],
  ];

  return (
    <section className="route-details-information">
      <article className="route-details-info-card">
        <h2>Деталі поїздки</h2>

        <dl className="route-details-info-grid">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="route-details-finance-card">
        <h2>Фінансовий підсумок</h2>

        <dl className="route-details-finance-list">
          <div>
            <dt>Дохід компанії</dt>
            <dd>{formatMoney(route.revenue)}</dd>
          </div>

          <div>
            <dt>Оплата водію</dt>
            <dd>{formatMoney(route.driverPayment)}</dd>
          </div>

          <div>
            <dt>Витрати на пальне</dt>
            <dd>{formatMoney(route.fuelCost)}</dd>
          </div>

          <div className="route-details-finance-list__profit">
            <dt>Прибуток</dt>
            <dd>{formatMoney(route.netProfit)}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

export default RouteInformationCards;