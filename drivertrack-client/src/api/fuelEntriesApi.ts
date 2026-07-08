import apiClient from "./client";

export type FuelEntry = {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
  odometerReading: number;
  liters: number;
  isFullTank: boolean;
  distanceSinceLastRefuel?: number | null;
  fuelConsumption?: number | null;
};

export type CreateFuelEntryRequest = {
  driverId: string;
  vehicleId: string;
  date: string;
  odometerReading: number;
  liters: number;
  isFullTank: boolean;
};

export type UpdateFuelEntryRequest = {
  date: string;
  odometerReading: number;
  liters: number;
  isFullTank: boolean;
};

export type GetFuelEntriesParams = {
  driverId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
};

export async function getFuelEntries(
  params?: GetFuelEntriesParams
): Promise<FuelEntry[]> {
  const response = await apiClient.get<FuelEntry[]>("/FuelEntries", {
    params,
  });

  return response.data;
}

export async function getFuelEntryById(id: string): Promise<FuelEntry> {
  const response = await apiClient.get<FuelEntry>(`/FuelEntries/${id}`);
  return response.data;
}

export async function createFuelEntry(
  request: CreateFuelEntryRequest
): Promise<string> {
  const response = await apiClient.post<string>("/FuelEntries", request);
  return response.data;
}

export async function updateFuelEntry(
  id: string,
  request: UpdateFuelEntryRequest
): Promise<void> {
  await apiClient.put(`/FuelEntries/${id}`, request);
}

export async function deleteFuelEntry(id: string): Promise<void> {
  await apiClient.delete(`/FuelEntries/${id}`);
}

export async function getFuelEntriesByDriverId(
  driverId: string
): Promise<FuelEntry[]> {
  return getFuelEntries({ driverId });
}

export async function getFuelEntriesByVehicleId(
  vehicleId: string
): Promise<FuelEntry[]> {
  return getFuelEntries({ vehicleId });
}