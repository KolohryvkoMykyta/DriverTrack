import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ArrowLeft, RefreshCw } from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getApiErrorMessage,
} from "../../api/apiErrorHandler";

import {
  getDrivers,
  type DriverListItem,
} from "../../api/driversApi";

import {
  deleteRouteEntry,
  getRouteEntryById,
  type RouteDetails,
} from "../../api/routeEntriesApi";

import {
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";

import {
  getVehicles,
  type Vehicle,
} from "../../api/vehiclesApi";

import {
  useAdminSidebar,
} from "../../contexts/AdminSidebarContext";

import DeleteRouteModal from "./route-details/DeleteRouteModal";
import EditRouteModal from "./route-details/EditRouteModal";
import RouteHeroCard from "./route-details/RouteHeroCard";
import RouteInformationCards from "./route-details/RouteInformationCards";
import RouteSummaryCards from "./route-details/RouteSummaryCards";

import "../../styles/admin-route-details.css";

async function fetchRouteDetailsPageData(routeId: string) {
  const [route, drivers, vehicles, routeTypes] = await Promise.all([
    getRouteEntryById(routeId),
    getDrivers(),
    getVehicles(),
    getRouteTypes(),
  ]);

  return {
    route,
    drivers,
    vehicles,
    routeTypes,
  };
}

function RouteDetailsPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { clearSidebarContent } = useAdminSidebar();

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadData = useCallback(async () => {
    if (!routeId) {
      setErrorMessage("Ідентифікатор маршруту відсутній.");
      setIsLoading(false);
      return;
    }

    try {
      setErrorMessage("");

      const data = await fetchRouteDetailsPageData(routeId);

      setRoute(data.route);
      setDrivers(data.drivers);
      setVehicles(data.vehicles);
      setRouteTypes(data.routeTypes);
    } catch (error) {
      console.error("Не вдалося завантажити маршрут:", error);
      setErrorMessage("Не вдалося завантажити деталі маршруту.");
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    clearSidebarContent();
  }, [clearSidebarContent]);

  useEffect(() => {
    if (!routeId) {
      const timeoutId = window.setTimeout(() => {
        setErrorMessage("Ідентифікатор маршруту відсутній.");
        setIsLoading(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    let isCancelled = false;

    void fetchRouteDetailsPageData(routeId)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setRoute(data.route);
        setDrivers(data.drivers);
        setVehicles(data.vehicles);
        setRouteTypes(data.routeTypes);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Не вдалося завантажити маршрут:", error);

        if (!isCancelled) {
          setErrorMessage("Не вдалося завантажити деталі маршруту.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [routeId]);

  const driverName = useMemo(
    () =>
      drivers.find((driver) => driver.id === route?.driverId)?.name ??
      "Невідомий водій",
    [drivers, route?.driverId]
  );

  const vehicle = useMemo(
    () => vehicles.find((item) => item.id === route?.vehicleId),
    [vehicles, route?.vehicleId]
  );

  const routeTypeName = useMemo(
    () =>
      routeTypes.find((routeType) => routeType.id === route?.routeTypeId)
        ?.name ?? "Невідомий маршрут",
    [routeTypes, route?.routeTypeId]
  );

  const availableVehicles = useMemo(() => {
    if (!route) {
      return [];
    }

    return vehicles.filter(
      (item) =>
        item.id === route.vehicleId ||
        (item.isActive && item.driverId === route.driverId)
    );
  }, [route, vehicles]);

  async function handleDelete() {
    if (!routeId) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteRouteEntry(routeId);
      navigate("/admin/routes");
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="route-details-message">
        <RefreshCw className="route-details-spinner" size={24} />
        Завантаження маршруту...
      </div>
    );
  }

  if (!route || errorMessage) {
    return (
      <div className="route-details-page">
        <Link className="route-details-back" to="/admin/routes">
          <ArrowLeft size={16} />
          Маршрути
        </Link>

        <div className="route-details-message route-details-message--error">
          <p>{errorMessage || "Маршрут не знайдено."}</p>

          <button type="button" onClick={() => void loadData()}>
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  const vehicleName = vehicle
    ? `${vehicle.brand} ${vehicle.model}`
    : "Невідомий автомобіль";

  const licensePlate = vehicle?.licensePlate ?? "Номер відсутній";

  return (
    <div className="route-details-page">
      <Link className="route-details-back" to="/admin/routes">
        <ArrowLeft size={16} />
        Маршрути
      </Link>

      <RouteHeroCard
        route={route}
        routeTypeName={routeTypeName}
        driverName={driverName}
        vehicleName={vehicleName}
        licensePlate={licensePlate}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => {
          setDeleteError("");
          setIsDeleteOpen(true);
        }}
      />

      <RouteSummaryCards
        distance={route.totalDistance}
        fuelUsed={route.fuelUsed}
        fuelCost={route.fuelCost}
        revenue={route.revenue}
        driverPayment={route.driverPayment}
      />

      <RouteInformationCards
        route={route}
        routeTypeName={routeTypeName}
        driverName={driverName}
        vehicleName={vehicleName}
        licensePlate={licensePlate}
      />

      {isEditOpen && (
        <EditRouteModal
          route={route}
          vehicles={availableVehicles}
          routeTypes={routeTypes}
          onClose={() => setIsEditOpen(false)}
          onUpdated={loadData}
        />
      )}

      {isDeleteOpen && (
        <DeleteRouteModal
          routeTypeName={routeTypeName}
          isDeleting={isDeleting}
          errorMessage={deleteError}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteOpen(false);
            }
          }}
          onConfirm={() => void handleDelete()}
        />
      )}
    </div>
  );
}

export default RouteDetailsPage;