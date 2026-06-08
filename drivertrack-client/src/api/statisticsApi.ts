import apiClient from "./client";

export type FuelPriceDto = {
  id: string;
  pricePerLiter: number;
  effectiveFrom: string;
};

export type DriverOverviewDto = {
  driverId: string;
  driverName: string;
  routeCount: number;
  revenue: number;
  driverPayment: number;
  fuelCost: number;
  netProfit: number;
};

export type VehicleOverviewDto = {
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  routeCount: number;
  totalDistance: number;
  totalFuelLiters: number;
  averageFuelConsumption: number | null;
};

export type AdminOverviewDto = {
  totalRevenue: number;
  totalDriverPayment: number;
  totalFuelCost: number;
  netProfit: number;
  routeCount: number;
  totalDistance: number;
  totalFuelLiters: number;
  averageFuelConsumption: number | null;
  currentFuelPrice: FuelPriceDto | null;
  drivers: DriverOverviewDto[];
  vehicles: VehicleOverviewDto[];
};

export type AdminOverviewFilters = {
  from?: string;
  to?: string;
  driverId?: string;
  vehicleId?: string;
};

export async function getAdminOverview(
  filters: AdminOverviewFilters
): Promise<AdminOverviewDto> {
  const response = await apiClient.get<AdminOverviewDto>(
    "/Statistics/admin-overview",
    { params: filters }
  );

  return response.data;
}