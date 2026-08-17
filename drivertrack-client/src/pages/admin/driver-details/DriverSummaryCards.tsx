import {
  Droplets,
  Gauge,
  Route,
  UserRound,
  WalletCards,
} from "lucide-react";

type DriverSummaryCardsProps = {
  routeCount: number;
  distance: number;
  fuelUsed: number | null;
  isFuelDataPartial: boolean;
  revenue: number;
  driverPayment: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} грн`;
}

function DriverSummaryCards({
  routeCount,
  distance,
  fuelUsed,
  isFuelDataPartial,
  revenue,
  driverPayment,
}: DriverSummaryCardsProps) {
  return (
    <section className="driver-summary">
      <h2 className="driver-summary__title">Показники за період</h2>

      <div className="driver-summary__grid">
        <article className="driver-summary-card">
          <div className="driver-summary-card__icon driver-summary-card__icon--purple">
            <Route size={21} />
          </div>

          <div>
            <span className="driver-summary-card__label">Маршрути</span>
            <strong className="driver-summary-card__value">
              {routeCount}
            </strong>
          </div>
        </article>

        <article className="driver-summary-card">
          <div className="driver-summary-card__icon driver-summary-card__icon--blue">
            <Gauge size={21} />
          </div>

          <div>
            <span className="driver-summary-card__label">Пробіг</span>
            <strong className="driver-summary-card__value">
              {formatNumber(distance)} км
            </strong>
          </div>
        </article>

        <article className="driver-summary-card">
          <div className="driver-summary-card__icon driver-summary-card__icon--cyan">
            <Droplets size={21} />
          </div>

          <div>
            <span className="driver-summary-card__label">
              Використано пального
            </span>
            <strong className="driver-summary-card__value">
              {fuelUsed === null ? "Немає даних" : `${formatNumber(fuelUsed)} л`}
            </strong>
            {isFuelDataPartial && (
              <small className="driver-summary-card__note">Неповні дані</small>
            )}
          </div>
        </article>

        <article className="driver-summary-card">
          <div className="driver-summary-card__icon driver-summary-card__icon--green">
            <WalletCards size={21} />
          </div>

          <div>
            <span className="driver-summary-card__label">
              Дохід компанії
            </span>
            <strong className="driver-summary-card__value">
              {formatMoney(revenue)}
            </strong>
          </div>
        </article>

        <article className="driver-summary-card">
          <div className="driver-summary-card__icon driver-summary-card__icon--orange">
            <UserRound size={21} />
          </div>

          <div>
            <span className="driver-summary-card__label">
              Зарплата водія
            </span>
            <strong className="driver-summary-card__value">
              {formatMoney(driverPayment)}
            </strong>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DriverSummaryCards;