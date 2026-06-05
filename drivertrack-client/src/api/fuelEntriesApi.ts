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

export async function getFuelEntriesByDriverId(
  driverId: string
): Promise<FuelEntry[]> {
  const response = await apiClient.get<FuelEntry[]>("/FuelEntries", {
    params: { driverId },
  });

  return response.data;
}

export async function createFuelEntry(
  request: CreateFuelEntryRequest
): Promise<string> {
  const response = await apiClient.post<string>(
    "/FuelEntries",
    request
  );

  return response.data;
}