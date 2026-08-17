import {
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";

type DriversSummaryCardsProps = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};

function DriversSummaryCards({
  totalCount,
  activeCount,
  inactiveCount,
}: DriversSummaryCardsProps) {
  return (
    <section
      className="drivers-summary"
      aria-label="Статистика водіїв"
    >
      <article className="drivers-summary-card drivers-summary-card--total">
        <span className="drivers-summary-card__icon">
          <UserRound
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="drivers-summary-card__content">
          <span className="drivers-summary-card__label">
            Усього водіїв
          </span>

          <strong className="drivers-summary-card__value">
            {totalCount}
          </strong>
        </span>
      </article>

      <article className="drivers-summary-card drivers-summary-card--active">
        <span className="drivers-summary-card__icon">
          <UserCheck
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="drivers-summary-card__content">
          <span className="drivers-summary-card__label">
            Активні
          </span>

          <strong className="drivers-summary-card__value">
            {activeCount}
          </strong>
        </span>
      </article>

      <article className="drivers-summary-card drivers-summary-card--inactive">
        <span className="drivers-summary-card__icon">
          <UserX
            size={24}
            strokeWidth={1.9}
          />
        </span>

        <span className="drivers-summary-card__content">
          <span className="drivers-summary-card__label">
            Неактивні
          </span>

          <strong className="drivers-summary-card__value">
            {inactiveCount}
          </strong>
        </span>
      </article>
    </section>
  );
}

export default DriversSummaryCards;