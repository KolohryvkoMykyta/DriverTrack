import apiClient from "./client";

export type RouteType = {
  id: string;
  name: string;
  driverPayment: number;
  revenue: number;
};

export type CreateRouteTypeRequest = {
  name: string;
  driverPayment: number;
  revenue: number;
};

export type UpdateRouteTypeRequest = {
  name: string;
  driverPayment: number;
  revenue: number;
};

export async function getRouteTypes(): Promise<RouteType[]> {
  const response = await apiClient.get<RouteType[]>("/RouteTypes");
  return response.data;
}

export async function createRouteType(
  request: CreateRouteTypeRequest
): Promise<string> {
  const response = await apiClient.post<string>("/RouteTypes", request);
  return response.data;
}

export async function updateRouteType(
  id: string,
  request: UpdateRouteTypeRequest
): Promise<void> {
  await apiClient.put(`/RouteTypes/${id}`, request);
}

export async function deleteRouteType(id: string): Promise<void> {
  await apiClient.delete(`/RouteTypes/${id}`);
}