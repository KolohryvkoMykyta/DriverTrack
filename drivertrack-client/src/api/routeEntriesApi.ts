import apiClient from "./client";

export type RouteEntry = {
  id: string;
  driverId: string;
  vehicleId: string;
  routeTypeId: string;
  startDate: string;
  startOdometer: number;
  endDate: string | null;
  endOdometer: number | null;
  totalDistance: number | null;
  fuelUsed: number | null;
  driverPayment: number;
  revenue: number;
};

export async function getRouteEntries(): Promise<RouteEntry[]> {
  const response = await apiClient.get<RouteEntry[]>("/RouteEntries");

  return response.data;
}

export async function getRouteEntriesByDriverId(
  driverId: string
): Promise<RouteEntry[]> {
  const response = await apiClient.get<RouteEntry[]>(
    `/RouteEntries?driverId=${driverId}`
  );

  return response.data;
}

export type CreateFullRouteRequest = {
  driverId: string;
  vehicleId: string;
  routeTypeId: string;
  startDate: string;
  startOdometer: number;
  endDate: string;
  endOdometer: number;
  totalDistance: number;
};

export async function createFullRoute(
  request: CreateFullRouteRequest
): Promise<string> {
  const response = await apiClient.post<string>(
    "/RouteEntries",
    request
  );

  return response.data;
}

export async function getRouteEntriesByVehicleId(
  vehicleId: string
): Promise<RouteEntry[]> {
  const response = await apiClient.get<RouteEntry[]>("/RouteEntries", {
    params: { vehicleId },
  });

  return response.data;
}