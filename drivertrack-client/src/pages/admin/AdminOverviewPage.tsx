import { useEffect } from "react";

import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

import OverviewDetails from "./overview/OverviewDetails";
import OverviewDetailsSwitcher from "./overview/OverviewDetailsSwitcher";
import OverviewFilters from "./overview/OverviewFilters";
import OverviewSummaryCards from "./overview/OverviewSummaryCards";
import useAdminOverview from "./overview/useAdminOverview";
import OverviewWelcomeCard from "./overview/OverviewWelcomeCard";

import "../../styles/admin-overview.css";

function AdminOverviewPage() {
  const {
    overview,
    drivers,
    vehicles,

    periodMode,
    from,
    to,
    driverId,
    vehicleId,

    detailsTab,

    isLoading,
    error,
    hasActiveFilters,

    changePeriodMode,
    changeFrom,
    changeTo,
    changeDriver,
    changeVehicle,
    resetFilters,

    setDetailsTab,
  } = useAdminOverview();

  const {
    setSidebarContent,
    clearSidebarContent,
  } = useAdminSidebar();

  useEffect(() => {
    setSidebarContent(
      <>
        <OverviewFilters
          drivers={drivers}
          vehicles={vehicles}
          periodMode={periodMode}
          from={from}
          to={to}
          driverId={driverId}
          vehicleId={vehicleId}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onPeriodModeChange={
            changePeriodMode
          }
          onFromChange={changeFrom}
          onToChange={changeTo}
          onDriverChange={changeDriver}
          onVehicleChange={changeVehicle}
          onReset={resetFilters}
        />

        <div className="admin-sidebar__divider" />

        <OverviewDetailsSwitcher
          detailsTab={detailsTab}
          onDetailsTabChange={setDetailsTab}
        />
      </>
    );

    return () => {
      clearSidebarContent();
    };
  }, [
    drivers,
    vehicles,
    periodMode,
    from,
    to,
    driverId,
    vehicleId,
    detailsTab,
    isLoading,
    hasActiveFilters,
    changePeriodMode,
    changeFrom,
    changeTo,
    changeDriver,
    changeVehicle,
    resetFilters,
    setDetailsTab,
    setSidebarContent,
    clearSidebarContent,
  ]);

  if (isLoading && !overview) {
    return (
      <p>Завантаження огляду...</p>
    );
  }

  return (
    <div className="overview-page">
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <OverviewWelcomeCard
        displayName="Admin"
      />

      {overview && (
        <>
          <OverviewSummaryCards
            overview={overview}
          />

          <OverviewDetails
            overview={overview}
            detailsTab={detailsTab}
          />
        </>
      )}
    </div>
  );
}

export default AdminOverviewPage;