import {
  Fuel,
  Gauge,
  Route,
  WalletCards,
} from "lucide-react";

type VehicleSummaryCardsProps = {
  routeCount: number;
  distance: number;
  fuelUsed: number;
  averageConsumption: number | null;
  revenue: number;
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

function VehicleSummaryCards({
  routeCount,
  distance,
  fuelUsed,
  averageConsumption,
  revenue,
}: VehicleSummaryCardsProps) {
  return (
    <section className="vehicle-summary">
      <h2 className="vehicle-summary__title">
        Показники за період
      </h2>

      <div className="vehicle-summary__grid">
        <article className="vehicle-summary-card">
          <div className="vehicle-summary-card__icon vehicle-summary-card__icon--purple">
            <Route size={21} />
          </div>

          <div>
            <span className="vehicle-summary-card__label">
              Маршрути
            </span>

            <strong className="vehicle-summary-card__value">
              {routeCount}
            </strong>
          </div>
        </article>

        <article className="vehicle-summary-card">
          <div className="vehicle-summary-card__icon vehicle-summary-card__icon--blue">
            <Gauge size={21} />
          </div>

          <div>
            <span className="vehicle-summary-card__label">
              Пробіг
            </span>

            <strong className="vehicle-summary-card__value">
              {formatNumber(distance)} км
            </strong>
          </div>
        </article>

        <article className="vehicle-summary-card">
          <div className="vehicle-summary-card__icon vehicle-summary-card__icon--cyan">
            <Fuel size={21} />
          </div>

          <div>
            <span className="vehicle-summary-card__label">
              Використано пального
            </span>

            <strong className="vehicle-summary-card__value">
              {formatNumber(fuelUsed)} л
            </strong>
          </div>
        </article>

        <article className="vehicle-summary-card">
          <div className="vehicle-summary-card__icon vehicle-summary-card__icon--orange">
            <Gauge size={21} />
          </div>

          <div>
            <span className="vehicle-summary-card__label">
              Середня витрата
            </span>

            <strong className="vehicle-summary-card__value">
              {averageConsumption === null
                ? "Немає даних"
                : `${formatNumber(averageConsumption)} л / 100 км`}
            </strong>
          </div>
        </article>

        <article className="vehicle-summary-card">
          <div className="vehicle-summary-card__icon vehicle-summary-card__icon--green">
            <WalletCards size={21} />
          </div>

          <div>
            <span className="vehicle-summary-card__label">
              Дохід компанії
            </span>

            <strong className="vehicle-summary-card__value">
              {formatMoney(revenue)}
            </strong>
          </div>
        </article>
      </div>
    </section>
  );
}

export default VehicleSummaryCards;