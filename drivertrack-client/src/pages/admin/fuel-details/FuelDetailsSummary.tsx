import {
  CircleGauge,
  Droplets,
  Gauge,
  Route,
} from "lucide-react";

import type { FuelEntry } from "../../../api/fuelEntriesApi";

type FuelDetailsSummaryProps = {
  entry: FuelEntry;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function FuelDetailsSummary({ entry }: FuelDetailsSummaryProps) {
  const cards = [
    {
      label: "Заправлено",
      value: `${numberFormatter.format(entry.liters)} л`,
      icon: <Droplets size={22} />,
      color: "cyan",
    },
    {
      label: "Одометр",
      value: `${numberFormatter.format(entry.odometerReading)} км`,
      icon: <Gauge size={22} />,
      color: "purple",
    },
    {
      label: "Відстань",
      value:
        entry.distanceSinceLastRefuel === null ||
        entry.distanceSinceLastRefuel === undefined
          ? "Немає даних"
          : `${numberFormatter.format(entry.distanceSinceLastRefuel)} км`,
      caption: "від попереднього повного бака",
      icon: <Route size={22} />,
      color: "blue",
    },
    {
      label: "Витрата",
      value:
        entry.fuelConsumption === null ||
        entry.fuelConsumption === undefined
          ? "Немає даних"
          : `${numberFormatter.format(entry.fuelConsumption)} л / 100 км`,
      icon: <CircleGauge size={22} />,
      color: "green",
    },
  ];

  return (
    <section className="fuel-details-summary">
      <h2>Показники заправки</h2>
      <div className="fuel-details-summary__grid">
        {cards.map((card) => (
          <article key={card.label} className="fuel-details-summary-card">
            <span
              className={`fuel-details-summary-card__icon fuel-details-summary-card__icon--${card.color}`}
            >
              {card.icon}
            </span>
            <div>
              <span className="fuel-details-summary-card__label">
                {card.label}
              </span>
              <strong className="fuel-details-summary-card__value">
                {card.value}
              </strong>
              {card.caption && (
                <small className="fuel-details-summary-card__caption">
                  {card.caption}
                </small>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FuelDetailsSummary;
