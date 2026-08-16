type OverviewWelcomeCardProps = {
  displayName: string;
};

function OverviewWelcomeCard({
  displayName,
}: OverviewWelcomeCardProps) {
  return (
    <section className="overview-welcome-card">
      <div className="overview-welcome-card__icon">
        ↗
      </div>

      <div className="overview-welcome-card__content">
        <h2>
          Вітаємо, {displayName}!
        </h2>

        <p>
          Тут ви можете переглядати ключові показники
          та статистику вашого автопарку.
        </p>
      </div>

      <div
        className="overview-welcome-card__illustration"
        aria-hidden="true"
      >
        🚚
      </div>
    </section>
  );
}

export default OverviewWelcomeCard;