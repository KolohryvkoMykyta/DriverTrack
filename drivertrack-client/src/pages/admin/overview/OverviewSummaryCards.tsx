import {
  Banknote,
  Droplets,
  Fuel,
  Gauge,
  MapPinned,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import type { AdminOverviewDto } from "../../../api/statisticsApi";

import {
  formatMoney,
  formatNumber,
} from "./overviewUtils";

type OverviewSummaryCardsProps = {
  overview: AdminOverviewDto;
};

function OverviewSummaryCards({
  overview,
}: OverviewSummaryCardsProps) {
  return (
    <div className="overview-summary">
      <section>
        <h3 className="overview-summary__section-title">
          Фінансові показники
        </h3>

        <div className="overview-summary__financial-grid">
          <article className="overview-kpi-card overview-kpi-card--green">
            <div className="overview-kpi-card__icon">
              <WalletCards size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Дохід компанії
              </span>

              <strong className="overview-kpi-card__value">
                {formatMoney(overview.totalRevenue)}
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--blue">
            <div className="overview-kpi-card__icon">
              <Users size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Зарплата водіям
              </span>

              <strong className="overview-kpi-card__value">
                {formatMoney(
                  overview.totalDriverPayment
                )}
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--orange">
            <div className="overview-kpi-card__icon">
              <Fuel size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Витрати на паливо
              </span>

              <strong className="overview-kpi-card__value">
                {formatMoney(
                  overview.totalFuelCost
                )}
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--purple">
            <div className="overview-kpi-card__icon">
              <TrendingUp size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Чистий прибуток
              </span>

              <strong className="overview-kpi-card__value">
                {formatMoney(overview.netProfit)}
              </strong>
            </div>
          </article>
        </div>
      </section>

      <section>
        <h3 className="overview-summary__section-title">
          Операційні показники
        </h3>

        <div className="overview-summary__operations-grid">
          <article className="overview-kpi-card overview-kpi-card--neutral">
            <div className="overview-kpi-card__icon">
              <MapPinned size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Маршрути
              </span>

              <strong className="overview-kpi-card__value">
                {overview.routeCount}
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--neutral">
            <div className="overview-kpi-card__icon">
              <Gauge size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Пробіг
              </span>

              <strong className="overview-kpi-card__value">
                {formatNumber(
                  overview.totalDistance
                )}{" "}
                км
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--neutral">
            <div className="overview-kpi-card__icon">
              <Droplets size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Паливо
              </span>

              <strong className="overview-kpi-card__value">
                {formatNumber(
                  overview.totalFuelLiters
                )}{" "}
                л
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--neutral">
            <div className="overview-kpi-card__icon">
              <Gauge size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Середня витрата
              </span>

              <strong className="overview-kpi-card__value">
                {overview.averageFuelConsumption ===
                null
                  ? "Немає даних"
                  : `${overview.averageFuelConsumption} л / 100 км`}
              </strong>
            </div>
          </article>

          <article className="overview-kpi-card overview-kpi-card--neutral">
            <div className="overview-kpi-card__icon">
              <Banknote size={20} />
            </div>

            <div className="overview-kpi-card__content">
              <span className="overview-kpi-card__label">
                Поточна ціна палива
              </span>

              <strong className="overview-kpi-card__value">
                {overview.currentFuelPrice === null
                  ? "Не задана"
                  : `${overview.currentFuelPrice.pricePerLiter} грн/л`}
              </strong>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default OverviewSummaryCards;