import apiClient from "./client";

export type Driver = {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

export type DriverVehicleListItem = {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
};

export type DriverListItem = Driver & {
  vehicles: DriverVehicleListItem[];
};

export type UpdateDriverRequest = {
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

export async function getDrivers(): Promise<DriverListItem[]> {
  const response = await apiClient.get<DriverListItem[]>(
    "/Drivers"
  );

  return response.data;
}

export async function getDriverById(
  id: string
): Promise<Driver> {
  const response = await apiClient.get<Driver>(
    `/Drivers/${id}`
  );

  return response.data;
}

export async function updateDriver(
  id: string,
  request: UpdateDriverRequest
): Promise<void> {
  await apiClient.put(`/Drivers/${id}`, request);
}