using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;

namespace DriverTrack.Infrastructure.Services
{
    public class VehicleAverageConsumptionCalculator : IVehicleAverageConsumptionCalculator
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;

        public VehicleAverageConsumptionCalculator(IFuelEntryRepository fuelEntryRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
        }

        public async Task<double?> CalculateAsync(Guid vehicleId, CancellationToken ct)
        {
            var allEntries = await _fuelEntryRepository.GetByVehicleIdAsync(vehicleId);

            var fullTankEntries = allEntries
                .Where(e => e.DistanceSinceLastRefuel != null && e.FuelConsumption != 0 )
                .Select(e => new
                {
                    Distance = e.DistanceSinceLastRefuel!.Value,
                    Consumption = e.FuelConsumption!.Value,
                })
                .ToList();

            if (fullTankEntries.Count == 0)
                return null;

            var totalDistance = fullTankEntries.Sum(e => e.Distance);
            if (totalDistance <= 0)
                return null;

            var consumption = fullTankEntries.Sum(e => e.Consumption * e.Distance);

            var averageConsumption = consumption / totalDistance;

            return Math.Round(averageConsumption, 2);
        }
    }
}
