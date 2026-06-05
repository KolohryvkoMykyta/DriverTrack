import apiClient from "./client";

export type Driver = {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

export async function getDrivers(): Promise<Driver[]> {
  const response = await apiClient.get<Driver[]>("/Drivers");

  return response.data;
}

export async function getDriverById(id: string): Promise<Driver> {
  const response = await apiClient.get<Driver>(`/Drivers/${id}`);

  return response.data;
}