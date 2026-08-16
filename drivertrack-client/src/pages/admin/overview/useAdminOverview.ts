import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getApiErrorMessage } from "../../../api/apiErrorHandler";
import {
  getDrivers,
  type Driver,
} from "../../../api/driversApi";
import {
  getAdminOverview,
  type AdminOverviewDto,
} from "../../../api/statisticsApi";
import {
  getVehicles,
  type Vehicle,
} from "../../../api/vehiclesApi";

import type {
  DetailsTab,
  PeriodMode,
} from "./overviewTypes";

import { getPeriodDates } from "./overviewUtils";

type OverviewFilterValues = {
  from: string;
  to: string;
  driverId: string;
  vehicleId: string;
};

const emptyFilters: OverviewFilterValues = {
  from: "",
  to: "",
  driverId: "",
  vehicleId: "",
};

function useAdminOverview() {
  const [overview, setOverview] =
    useState<AdminOverviewDto | null>(null);

  const [drivers, setDrivers] =
    useState<Driver[]>([]);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [periodMode, setPeriodMode] =
    useState<PeriodMode>("month");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [driverId, setDriverId] =
    useState("");
  const [vehicleId, setVehicleId] =
    useState("");

  const [detailsTab, setDetailsTab] =
    useState<DetailsTab>("drivers");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const requestOverview = useCallback(
    async (
      mode: PeriodMode,
      filters: OverviewFilterValues
    ) => {
      const periodDates = getPeriodDates(mode, {
        from: filters.from,
        to: filters.to,
      });

      return getAdminOverview({
        from: periodDates.from,
        to: periodDates.to,
        driverId:
          filters.driverId || undefined,
        vehicleId:
          filters.vehicleId || undefined,
      });
    },
    []
  );

  const loadOverview = useCallback(
    async (
      mode: PeriodMode,
      filters: OverviewFilterValues
    ) => {
      try {
        setIsLoading(true);
        setError("");

        const data = await requestOverview(
          mode,
          filters
        );

        setOverview(data);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [requestOverview]
  );

  const changePeriodMode = useCallback(
    async (mode: PeriodMode) => {
      setPeriodMode(mode);

      const currentFilters: OverviewFilterValues = {
        from,
        to,
        driverId,
        vehicleId,
      };

      if (mode === "custom") {
        if (from && to) {
          await loadOverview(
            "custom",
            currentFilters
          );
        }

        return;
      }

      await loadOverview(
        mode,
        currentFilters
      );
    },
    [
      from,
      to,
      driverId,
      vehicleId,
      loadOverview,
    ]
  );

  const changeFrom = useCallback(
    async (value: string) => {
      setFrom(value);

      if (
        periodMode === "custom" &&
        value &&
        to
      ) {
        await loadOverview("custom", {
          from: value,
          to,
          driverId,
          vehicleId,
        });
      }
    },
    [
      periodMode,
      to,
      driverId,
      vehicleId,
      loadOverview,
    ]
  );

  const changeTo = useCallback(
    async (value: string) => {
      setTo(value);

      if (
        periodMode === "custom" &&
        from &&
        value
      ) {
        await loadOverview("custom", {
          from,
          to: value,
          driverId,
          vehicleId,
        });
      }
    },
    [
      periodMode,
      from,
      driverId,
      vehicleId,
      loadOverview,
    ]
  );

  const changeDriver = useCallback(
    async (value: string) => {
      setDriverId(value);

      if (
        periodMode === "custom" &&
        (!from || !to)
      ) {
        return;
      }

      await loadOverview(periodMode, {
        from,
        to,
        driverId: value,
        vehicleId,
      });
    },
    [
      periodMode,
      from,
      to,
      vehicleId,
      loadOverview,
    ]
  );

  const changeVehicle = useCallback(
    async (value: string) => {
      setVehicleId(value);

      if (
        periodMode === "custom" &&
        (!from || !to)
      ) {
        return;
      }

      await loadOverview(periodMode, {
        from,
        to,
        driverId,
        vehicleId: value,
      });
    },
    [
      periodMode,
      from,
      to,
      driverId,
      loadOverview,
    ]
  );

  const resetFilters = useCallback(
    async () => {
      setPeriodMode("month");
      setFrom("");
      setTo("");
      setDriverId("");
      setVehicleId("");

      await loadOverview(
        "month",
        emptyFilters
      );
    },
    [loadOverview]
  );

  useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true);
        setError("");

        const [
          driversData,
          vehiclesData,
          overviewData,
        ] = await Promise.all([
          getDrivers(),
          getVehicles(),
          requestOverview(
            "month",
            emptyFilters
          ),
        ]);

        setDrivers(driversData);
        setVehicles(vehiclesData);
        setOverview(overviewData);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [requestOverview]);

  const hasActiveFilters =
    periodMode !== "month" ||
    from !== "" ||
    to !== "" ||
    driverId !== "" ||
    vehicleId !== "";

  return {
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
  };
}

export default useAdminOverview;