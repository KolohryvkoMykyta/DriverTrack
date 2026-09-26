import {
  Fuel,
  Gauge,
  Route,
  UserRound,
  WalletCards,
} from "lucide-react";

type RoutesSummaryCardsProps = {
  routeCount: number;
  distance: number;
  fuelUsed: number;
  revenue: number;
  driverPayment: number;
};

const numberFormatter =
  new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatMoney(value: number) {
  return `${formatNumber(value)} грн`;
}

function RoutesSummaryCards({
  routeCount,
  distance,
  fuelUsed,
  revenue,
  driverPayment,
}: RoutesSummaryCardsProps) {
  return (
    <section className="routes-summary">
      <h2 className="routes-summary__title">
        Показники за період
      </h2>

      <div className="routes-summary__grid">
        <article className="routes-summary-card">
          <span className="routes-summary-card__icon routes-summary-card__icon--purple">
            <Route size={22} />
          </span>

          <span>
            <span className="routes-summary-card__label">
              Маршрути
            </span>

            <strong className="routes-summary-card__value">
              {routeCount}
            </strong>
          </span>
        </article>

        <article className="routes-summary-card">
          <span className="routes-summary-card__icon routes-summary-card__icon--blue">
            <Gauge size={22} />
          </span>

          <span>
            <span className="routes-summary-card__label">
              Пробіг
            </span>

            <strong className="routes-summary-card__value">
              {formatNumber(distance)} км
            </strong>
          </span>
        </article>

        <article className="routes-summary-card">
          <span className="routes-summary-card__icon routes-summary-card__icon--cyan">
            <Fuel size={22} />
          </span>

          <span>
            <span className="routes-summary-card__label">
              Використано пального
            </span>

            <strong className="routes-summary-card__value">
              {formatNumber(fuelUsed)} л
            </strong>
          </span>
        </article>

        <article className="routes-summary-card">
          <span className="routes-summary-card__icon routes-summary-card__icon--green">
            <WalletCards size={22} />
          </span>

          <span>
            <span className="routes-summary-card__label">
              Дохід компанії
            </span>

            <strong className="routes-summary-card__value">
              {formatMoney(revenue)}
            </strong>
          </span>
        </article>

        <article className="routes-summary-card">
          <span className="routes-summary-card__icon routes-summary-card__icon--orange">
            <UserRound size={22} />
          </span>

          <span>
            <span className="routes-summary-card__label">
              Водіям
            </span>

            <strong className="routes-summary-card__value">
              {formatMoney(
                driverPayment
              )}
            </strong>
          </span>
        </article>
      </div>
    </section>
  );
}

export default RoutesSummaryCards;