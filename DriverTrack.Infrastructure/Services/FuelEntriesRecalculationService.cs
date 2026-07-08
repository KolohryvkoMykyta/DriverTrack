using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Infrastructure.Services
{
    public class FuelEntriesRecalculationService : IFuelEntriesRecalculationService
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;

        public FuelEntriesRecalculationService(IFuelEntryRepository fuelEntryRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
        }

        public async Task RecalculateForVehicleAsync(Guid vehicleId, CancellationToken ct)
        {
            var entries = await _fuelEntryRepository.GetTrackedByVehicleIdAsync(vehicleId, ct);

            FuelEntry? lastFullTankEntry = null;
            double litersSinceLastFullTank = 0;

            foreach (var entry in entries)
            {
                entry.DistanceSinceLastRefuel = null;
                entry.FuelConsumption = null;

                if (!entry.IsFullTank)
                {
                    litersSinceLastFullTank += entry.Liters;
                    continue;
                }

                if (lastFullTankEntry is null)
                {
                    lastFullTankEntry = entry;
                    litersSinceLastFullTank = 0;
                    continue;
                }

                var distance = entry.OdometerReading - lastFullTankEntry.OdometerReading;

                if (distance <= 0)
                {
                    lastFullTankEntry = entry;
                    litersSinceLastFullTank = 0;
                    continue;
                }

                var litersUsed = litersSinceLastFullTank + entry.Liters;
                var consumption = Math.Round((litersUsed / distance) * 100, 2);

                entry.DistanceSinceLastRefuel = distance;
                entry.FuelConsumption = consumption;

                lastFullTankEntry = entry;
                litersSinceLastFullTank = 0;
            }
        }
    }
}