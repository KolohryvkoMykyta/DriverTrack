import apiClient from "./client";

export type RouteType = {
  id: string;
  name: string;
  earnings: number;
};

export async function getRouteTypes(): Promise<RouteType[]> {
  const response = await apiClient.get<RouteType[]>("/RouteTypes");

  return response.data;
}

export async function createRouteType(
  name: string,
  earnings: number
): Promise<string> {
  const response = await apiClient.post<string>("/RouteTypes", {
    name,
    earnings,
  });

  return response.data;
}

export async function deleteRouteType(id: string): Promise<void> {
  await apiClient.delete(`/RouteTypes/${id}`);
}