using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Infrastructure.Services
{
    public sealed class OverviewStatisticsBuilder : IOverviewStatisticsBuilder
    {
        private readonly IFuelCostCalculator _fuelCostCalculator;

        public OverviewStatisticsBuilder(IFuelCostCalculator fuelCostCalculator)
        {
            _fuelCostCalculator = fuelCostCalculator;
        }

        public async Task<List<DriverOverviewDto>> BuildDriversAsync(
            List<RouteEntry> routes,
            List<FuelEntry> fuelEntries,
            CancellationToken cancellationToken = default)
        {
            var routesByDriver = routes
                .GroupBy(route => route.DriverId)
                .ToDictionary(group => group.Key, group => group.ToList());

            var fuelEntriesByDriver = fuelEntries
                .GroupBy(fuelEntry => fuelEntry.DriverId)
                .ToDictionary(group => group.Key, group => group.ToList());

            var driverIds = routesByDriver.Keys
                .Concat(fuelEntriesByDriver.Keys)
                .Distinct()
                .ToList();

            var result = new List<DriverOverviewDto>();

            foreach (var driverId in driverIds)
            {
                routesByDriver.TryGetValue(driverId, out var driverRoutes);
                fuelEntriesByDriver.TryGetValue(driverId, out var driverFuelEntries);

                driverRoutes ??= [];
                driverFuelEntries ??= [];

                var driverName =
                    driverRoutes.FirstOrDefault()?.Driver?.Name
                    ?? driverFuelEntries.FirstOrDefault()?.Driver?.Name
                    ?? string.Empty;

                var revenue = driverRoutes.Sum(route => route.Revenue);
                var driverPayment = driverRoutes.Sum(route => route.DriverPayment);
                var fuelCost = await _fuelCostCalculator.CalculateAsync(
                    driverFuelEntries,
                    cancellationToken);

                result.Add(new DriverOverviewDto
                {
                    DriverId = driverId,
                    DriverName = driverName,
                    RouteCount = driverRoutes.Count,
                    Revenue = revenue,
                    DriverPayment = driverPayment,
                    FuelCost = fuelCost,
                    NetProfit = revenue - driverPayment - fuelCost
                });
            }

            return result
                .OrderByDescending(driver => driver.NetProfit)
                .ToList();
        }

        public List<VehicleOverviewDto> BuildVehicles(
            List<RouteEntry> routes,
            List<FuelEntry> fuelEntries)
        {
            var routesByVehicle = routes
                .GroupBy(route => route.VehicleId)
                .ToDictionary(group => group.Key, group => group.ToList());

            var fuelEntriesByVehicle = fuelEntries
                .GroupBy(fuelEntry => fuelEntry.VehicleId)
                .ToDictionary(group => group.Key, group => group.ToList());

            var vehicleIds = routesByVehicle.Keys
                .Concat(fuelEntriesByVehicle.Keys)
                .Distinct()
                .ToList();

            var result = new List<VehicleOverviewDto>();

            foreach (var vehicleId in vehicleIds)
            {
                routesByVehicle.TryGetValue(vehicleId, out var vehicleRoutes);
                fuelEntriesByVehicle.TryGetValue(vehicleId, out var vehicleFuelEntries);

                vehicleRoutes ??= [];
                vehicleFuelEntries ??= [];

                var vehicle =
                    vehicleRoutes.FirstOrDefault()?.Vehicle
                    ?? vehicleFuelEntries.FirstOrDefault()?.Vehicle;

                var distance = vehicleRoutes.Sum(route => route.TotalDistance ?? 0);
                var liters = vehicleFuelEntries.Sum(fuelEntry => fuelEntry.Liters);

                result.Add(new VehicleOverviewDto
                {
                    VehicleId = vehicleId,
                    VehicleName = vehicle is null
                        ? string.Empty
                        : $"{vehicle.Brand} {vehicle.Model}",
                    LicensePlate = vehicle?.LicensePlate ?? string.Empty,
                    RouteCount = vehicleRoutes.Count,
                    TotalDistance = distance,
                    TotalFuelLiters = liters,
                    AverageFuelConsumption = distance > 0 && liters > 0
                        ? Math.Round(liters / distance * 100, 2)
                        : null
                });
            }

            return result
                .OrderByDescending(vehicle => vehicle.TotalDistance)
                .ToList();
        }
    }
}