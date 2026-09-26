import {
  Droplets,
  Fuel,
  Gauge,
  ListChecks,
  TrendingUp,
} from "lucide-react";

type FuelSummaryCardsProps = {
  entryCount: number;
  totalLiters: number;
  fullTankCount: number;
  averageRefuel: number | null;
  averageConsumption: number | null;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function FuelSummaryCards({
  entryCount,
  totalLiters,
  fullTankCount,
  averageRefuel,
  averageConsumption,
}: FuelSummaryCardsProps) {
  const cards = [
    {
      label: "Заправки",
      value: String(entryCount),
      icon: <ListChecks size={22} />,
      color: "purple",
    },
    {
      label: "Заправлено",
      value: `${formatNumber(totalLiters)} л`,
      icon: <Droplets size={22} />,
      color: "cyan",
    },
    {
      label: "Повний бак",
      value: String(fullTankCount),
      icon: <Fuel size={22} />,
      color: "green",
    },
    {
      label: "Середня заправка",
      value:
        averageRefuel === null
          ? "Немає даних"
          : `${formatNumber(averageRefuel)} л`,
      icon: <TrendingUp size={22} />,
      color: "orange",
    },
    {
      label: "Середня витрата",
      value:
        averageConsumption === null
          ? "Немає даних"
          : `${formatNumber(averageConsumption)} л / 100 км`,
      icon: <Gauge size={22} />,
      color: "blue",
    },
  ];

  return (
    <section className="fuel-summary">
      <h2 className="fuel-summary__title">Показники за період</h2>

      <div className="fuel-summary__grid">
        {cards.map((card) => (
          <article key={card.label} className="fuel-summary-card">
            <span
              className={`fuel-summary-card__icon fuel-summary-card__icon--${card.color}`}
            >
              {card.icon}
            </span>
            <span>
              <span className="fuel-summary-card__label">{card.label}</span>
              <strong className="fuel-summary-card__value">{card.value}</strong>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FuelSummaryCards;
