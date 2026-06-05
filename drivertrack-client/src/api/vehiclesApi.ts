import apiClient from "./client";

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  isActive: boolean;
  driverId: string | null;
  averageFuelConsumption: number | null;
};

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await apiClient.get<Vehicle[]>("/Vehicles");

  return response.data;
}

export async function getVehiclesByDriverId(
  driverId: string
): Promise<Vehicle[]> {
  const response = await apiClient.get<Vehicle[]>(
    `/Vehicles?driverId=${driverId}`
  );

  return response.data;
}

export type CreateVehicleRequest = {
  brand: string;
  model: string;
  licensePlate: string;
  driverId: string | null;
};

export async function createVehicle(
  request: CreateVehicleRequest
): Promise<string> {
  const response = await apiClient.post<string>(
    "/Vehicles",
    request
  );

  return response.data;
}