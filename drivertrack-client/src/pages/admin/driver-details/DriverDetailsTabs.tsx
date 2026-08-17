import type { DriverDetailsTab } from "./DriverDetailsFilters";

type DriverDetailsTabsProps = {
  activeTab: DriverDetailsTab;
  onChange: (tab: DriverDetailsTab) => void;
};

const tabs: Array<{
  value: DriverDetailsTab;
  label: string;
}> = [
  {
    value: "vehicles",
    label: "Автомобілі",
  },
  {
    value: "routes",
    label: "Маршрути",
  },
  {
    value: "fuel",
    label: "Заправки",
  },
];

function DriverDetailsTabs({
  activeTab,
  onChange,
}: DriverDetailsTabsProps) {
  return (
    <div className="driver-details-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.value}
          className={
            activeTab === tab.value
              ? "driver-details-tab driver-details-tab--active"
              : "driver-details-tab"
          }
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default DriverDetailsTabs;