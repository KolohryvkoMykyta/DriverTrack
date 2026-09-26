import {
  Car,
  CircleCheck,
  CircleX,
} from "lucide-react";

type VehiclesSummaryCardsProps = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};

function VehiclesSummaryCards({
  totalCount,
  activeCount,
  inactiveCount,
}: VehiclesSummaryCardsProps) {
  return (
    <section
      className="vehicles-summary"
      aria-label="Статистика автомобілів"
    >
      <article className="vehicles-summary-card vehicles-summary-card--total">
        <span className="vehicles-summary-card__icon">
          <Car
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="vehicles-summary-card__content">
          <span className="vehicles-summary-card__label">
            Усього автомобілів
          </span>

          <strong className="vehicles-summary-card__value">
            {totalCount}
          </strong>
        </span>
      </article>

      <article className="vehicles-summary-card vehicles-summary-card--active">
        <span className="vehicles-summary-card__icon">
          <CircleCheck
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="vehicles-summary-card__content">
          <span className="vehicles-summary-card__label">
            Активні
          </span>

          <strong className="vehicles-summary-card__value">
            {activeCount}
          </strong>
        </span>
      </article>

      <article className="vehicles-summary-card vehicles-summary-card--inactive">
        <span className="vehicles-summary-card__icon">
          <CircleX
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="vehicles-summary-card__content">
          <span className="vehicles-summary-card__label">
            Неактивні
          </span>

          <strong className="vehicles-summary-card__value">
            {inactiveCount}
          </strong>
        </span>
      </article>
    </section>
  );
}

export default VehiclesSummaryCards;