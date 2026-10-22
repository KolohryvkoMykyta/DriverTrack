import apiClient from "./client";

export type DriverVehicle = {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  averageFuelConsumption: number | null;
};

export type DriverRouteType = {
  id: string;
  name: string;
  driverPayment: number;
};

export type OpenDriverRoute = {
  id: string;
  vehicleId: string;
  routeTypeId: string;
  startDate: string;
  startOdometer: number;
  driverPayment: number;
};

export type OpenDriverRouteRequest = {
  vehicleId: string;
  routeTypeId: string;
  startDate: string;
  startOdometer: number;
};

export type CloseDriverRouteRequest = {
  endOdometer: number;
  endDate: string | null;
};

export async function getDriverVehicles(): Promise<DriverVehicle[]> {
  const response = await apiClient.get<DriverVehicle[]>(
    "/driver/vehicles"
  );

  return response.data;
}

export async function getDriverRouteTypes(): Promise<DriverRouteType[]> {
  const response = await apiClient.get<DriverRouteType[]>(
    "/driver/route-types"
  );

  return response.data;
}

export async function getOpenDriverRoute(): Promise<OpenDriverRoute | null> {
  const response = await apiClient.get<OpenDriverRoute | undefined>(
    "/driver/routes/open"
  );

  if (response.status === 204) {
    return null;
  }

  return response.data ?? null;
}

export async function openDriverRoute(
  request: OpenDriverRouteRequest
): Promise<string> {
  const response = await apiClient.post<string>(
    "/driver/routes/open",
    request
  );

  return response.data;
}

export async function closeDriverRoute(
  routeId: string,
  request: CloseDriverRouteRequest
): Promise<void> {
  await apiClient.put(
    `/driver/routes/${routeId}/close`,
    request
  );
}

export type DriverDashboardRoute = {
  id: string;
  routeTypeName: string;
  vehicleName: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  totalDistance: number;
  driverPayment: number;
};

export type DriverDashboard = {
  completedRouteCount: number;
  totalDistance: number;
  totalDriverPayment: number;
  recentRoutes: DriverDashboardRoute[];
};

export async function getDriverDashboard(
  from: string,
  to: string
): Promise<DriverDashboard> {
  const response = await apiClient.get<DriverDashboard>(
    "/driver/dashboard",
    {
      params: { from, to },
    }
  );

  return response.data;
}

export type DriverFuelEntry = {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
  odometerReading: number;
  liters: number;
  isFullTank: boolean;
  distanceSinceLastRefuel: number | null;
  fuelConsumption: number | null;
};

export async function getDriverFuelEntries(
  from: string,
  to: string
): Promise<DriverFuelEntry[]> {
  const response =
    await apiClient.get<DriverFuelEntry[]>(
      "/driver/fuel-entries",
      {
        params: {
          from,
          to,
        },
      }
    );

  return response.data;
}