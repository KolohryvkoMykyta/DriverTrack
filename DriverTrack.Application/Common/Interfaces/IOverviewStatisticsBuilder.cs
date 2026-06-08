using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Common.Interfaces
{
    public interface IOverviewStatisticsBuilder
    {
        Task<List<DriverOverviewDto>> BuildDriversAsync(
            List<RouteEntry> routes,
            List<FuelEntry> fuelEntries,
            CancellationToken cancellationToken = default);

        List<VehicleOverviewDto> BuildVehicles(
            List<RouteEntry> routes,
            List<FuelEntry> fuelEntries);
    }
}