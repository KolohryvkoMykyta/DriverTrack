import {
  Banknote,
  Fuel,
  Gauge,
  ReceiptText,
  UserRound,
  WalletCards,
} from "lucide-react";

type RouteSummaryCardsProps = {
  distance: number | null;
  fuelUsed: number | null;
  fuelCost: number | null;
  revenue: number;
  driverPayment: number;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatMoney(value: number) {
  return `${formatNumber(value)} грн`;
}

function RouteSummaryCards({
  distance,
  fuelUsed,
  fuelCost,
  revenue,
  driverPayment,
}: RouteSummaryCardsProps) {
  const averageConsumption =
    distance && fuelUsed !== null
      ? (fuelUsed / distance) * 100
      : null;

  const cards = [
    {
      label: "Пробіг",
      value:
        distance === null
          ? "Немає даних"
          : `${formatNumber(distance)} км`,
      icon: <Gauge size={21} />,
      tone: "purple",
    },
    {
      label: "Використано пального",
      value:
        fuelUsed === null
          ? "Немає даних"
          : `${formatNumber(fuelUsed)} л`,
      icon: <Fuel size={21} />,
      tone: "cyan",
    },
    {
      label: "Середня витрата",
      value:
        averageConsumption === null
          ? "Немає даних"
          : `${formatNumber(averageConsumption)} л / 100 км`,
      icon: <ReceiptText size={21} />,
      tone: "blue",
    },
    {
      label: "Вартість пального",
      value:
        fuelCost === null
          ? "Немає даних"
          : formatMoney(fuelCost),
      icon: <Banknote size={21} />,
      tone: "yellow",
    },
    {
      label: "Дохід компанії",
      value: formatMoney(revenue),
      icon: <WalletCards size={21} />,
      tone: "green",
    },
    {
      label: "Оплата водію",
      value: formatMoney(driverPayment),
      icon: <UserRound size={21} />,
      tone: "orange",
    },
  ];

  return (
    <section className="route-details-summary">
      <h2>Показники маршруту</h2>

      <div className="route-details-summary__grid">
        {cards.map((card) => (
          <article
            key={card.label}
            className="route-details-summary-card"
          >
            <span
              className={`route-details-summary-card__icon route-details-summary-card__icon--${card.tone}`}
              aria-hidden="true"
            >
              {card.icon}
            </span>

            <div>
              <span className="route-details-summary-card__label">
                {card.label}
              </span>

              <strong className="route-details-summary-card__value">
                {card.value}
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RouteSummaryCards;