import type { AdminOverviewDto } from "../../../api/statisticsApi";

import DriversOverviewTable from "./DriversOverviewTable";
import type { DetailsTab } from "./overviewTypes";
import VehiclesOverviewTable from "./VehiclesOverviewTable";

type OverviewDetailsProps = {
  overview: AdminOverviewDto;
  detailsTab: DetailsTab;
};

function OverviewDetails({
  overview,
  detailsTab,
}: OverviewDetailsProps) {
  return (
    <section>
      {detailsTab === "drivers" && (
        <DriversOverviewTable
          drivers={overview.drivers}
        />
      )}

      {detailsTab === "vehicles" && (
        <VehiclesOverviewTable
          vehicles={overview.vehicles}
        />
      )}
    </section>
  );
}

export default OverviewDetails;