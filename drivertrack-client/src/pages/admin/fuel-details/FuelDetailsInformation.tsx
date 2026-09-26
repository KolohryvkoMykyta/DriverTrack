import {
  CircleGauge,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { FuelEntry } from "../../../api/fuelEntriesApi";

type FuelDetailsInformationProps = {
  entry: FuelEntry;
  driverName: string;
  vehicleName: string;
  licensePlate: string;
  vehicleAverageConsumption: number | null;
};

const numberFormatter = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FuelDetailsInformation({
  entry,
  driverName,
  vehicleName,
  licensePlate,
  vehicleAverageConsumption,
}: FuelDetailsInformationProps) {
  const currentConsumption = entry.fuelConsumption ?? null;
  const canCompare =
    currentConsumption !== null && vehicleAverageConsumption !== null;
  const difference = canCompare
    ? currentConsumption - vehicleAverageConsumption
    : null;

  const comparisonState =
    difference === null
      ? "unavailable"
      : Math.abs(difference) < 0.01
        ? "equal"
        : difference < 0
          ? "better"
          : "worse";

  const comparisonText =
    difference === null
      ? "Недостатньо даних для порівняння"
      : comparisonState === "equal"
        ? "Відповідає середній витраті"
        : `${numberFormatter.format(Math.abs(difference))} л ${
            difference < 0 ? "нижче" : "вище"
          } середньої`;

  return (
    <section className="fuel-details-information">
      <article className="fuel-details-info-card">
        <h2>Дані заправки</h2>
        <dl className="fuel-details-info-list">
          <div>
            <dt>Дата і час</dt>
            <dd>{formatDateTime(entry.date)}</dd>
          </div>
          <div>
            <dt>Водій</dt>
            <dd>{driverName}</dd>
          </div>
          <div>
            <dt>Автомобіль</dt>
            <dd>{vehicleName}</dd>
          </div>
          <div>
            <dt>Державний номер</dt>
            <dd>{licensePlate}</dd>
          </div>
          <div>
            <dt>Одометр</dt>
            <dd>{numberFormatter.format(entry.odometerReading)} км</dd>
          </div>
          <div>
            <dt>Тип заправки</dt>
            <dd>{entry.isFullTank ? "Повний бак" : "Часткова заправка"}</dd>
          </div>
        </dl>
      </article>

      <article className="fuel-details-analysis-card">
        <h2>Аналіз витрати</h2>

        <div className="fuel-details-analysis__metrics">
          <div>
            <span className="fuel-details-analysis__icon fuel-details-analysis__icon--current">
              <CircleGauge size={22} />
            </span>
            <span>
              <small>Поточна витрата</small>
              <strong>
                {currentConsumption === null
                  ? "Немає даних"
                  : `${numberFormatter.format(currentConsumption)} л / 100 км`}
              </strong>
            </span>
          </div>

          <div>
            <span className="fuel-details-analysis__icon fuel-details-analysis__icon--average">
              <CircleGauge size={22} />
            </span>
            <span>
              <small>Середня по автомобілю</small>
              <strong>
                {vehicleAverageConsumption === null
                  ? "Немає даних"
                  : `${numberFormatter.format(vehicleAverageConsumption)} л / 100 км`}
              </strong>
            </span>
          </div>
        </div>

        <div
          className={`fuel-details-comparison fuel-details-comparison--${comparisonState}`}
        >
          {comparisonState === "better" ? (
            <TrendingDown size={24} />
          ) : comparisonState === "worse" ? (
            <TrendingUp size={24} />
          ) : comparisonState === "equal" ? (
            <Minus size={24} />
          ) : (
            <Info size={24} />
          )}
          <strong>{comparisonText}</strong>
        </div>

        <p className="fuel-details-analysis__note">
          <Info size={16} />
          Розраховано методом повного бака
        </p>
      </article>
    </section>
  );
}

export default FuelDetailsInformation;