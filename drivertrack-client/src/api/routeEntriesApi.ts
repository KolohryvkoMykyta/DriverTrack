import apiClient from "./client";

export type RouteEntry = {
  id: string;
  driverId: string;
  vehicleId: string;
  routeTypeId: string;

  startDate: string;
  endDate: string | null;

  startOdometer: number;
  endOdometer: number;

  totalDistance: number;
  fuelUsed: number;
  earnings: number;
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