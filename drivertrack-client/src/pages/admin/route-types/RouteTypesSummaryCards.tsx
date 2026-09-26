import {
  Calculator,
  Map,
  UserRound,
  WalletCards,
} from "lucide-react";

type RouteTypesSummaryCardsProps = {
  count: number;
  averageRevenue: number;
  averageDriverPayment: number;
  averageRemainder: number;
};

const moneyFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return `${moneyFormatter.format(value)} грн`;
}

function RouteTypesSummaryCards({
  count,
  averageRevenue,
  averageDriverPayment,
  averageRemainder,
}: RouteTypesSummaryCardsProps) {
  const cards = [
    {
      label: "Типи маршрутів",
      value: String(count),
      icon: <Map size={22} />,
      color: "purple",
    },
    {
      label: "Середній дохід",
      value: formatMoney(averageRevenue),
      icon: <WalletCards size={22} />,
      color: "green",
    },
    {
      label: "Середня виплата водію",
      value: formatMoney(averageDriverPayment),
      icon: <UserRound size={22} />,
      color: "orange",
    },
    {
      label: "Залишок до пального",
      value: formatMoney(averageRemainder),
      icon: <Calculator size={22} />,
      color: "blue",
    },
  ];

  return (
    <section className="route-types-summary">
      <h2>Загальні показники</h2>
      <div className="route-types-summary__grid">
        {cards.map((card) => (
          <article key={card.label} className="route-types-summary-card">
            <span
              className={`route-types-summary-card__icon route-types-summary-card__icon--${card.color}`}
            >
              {card.icon}
            </span>
            <span>
              <span className="route-types-summary-card__label">
                {card.label}
              </span>
              <strong className="route-types-summary-card__value">
                {card.value}
              </strong>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RouteTypesSummaryCards;
