import type { DetailsTab } from "./overviewTypes";

type OverviewDetailsSwitcherProps = {
  detailsTab: DetailsTab;
  onDetailsTabChange: (tab: DetailsTab) => void;
};

function OverviewDetailsSwitcher({
  detailsTab,
  onDetailsTabChange,
}: OverviewDetailsSwitcherProps) {
  return (
    <section className="overview-details-switcher">
      <h3 className="overview-sidebar-section__title">
        Деталізація
      </h3>

      <div className="overview-details-switcher__options">
        <button
          type="button"
          className={
            detailsTab === "drivers"
              ? "overview-sidebar-option overview-sidebar-option--active"
              : "overview-sidebar-option"
          }
          onClick={() =>
            onDetailsTabChange("drivers")
          }
        >
          Водії
        </button>

        <button
          type="button"
          className={
            detailsTab === "vehicles"
              ? "overview-sidebar-option overview-sidebar-option--active"
              : "overview-sidebar-option"
          }
          onClick={() =>
            onDetailsTabChange("vehicles")
          }
        >
          Автомобілі
        </button>
      </div>
    </section>
  );
}

export default OverviewDetailsSwitcher;