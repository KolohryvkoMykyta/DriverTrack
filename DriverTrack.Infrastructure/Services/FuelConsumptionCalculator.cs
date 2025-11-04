using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;

namespace DriverTrack.Infrastructure.Services
{
    public class FuelConsumptionCalculator : IFuelConsumptionCalculator
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;

        public FuelConsumptionCalculator(IFuelEntryRepository fuelEntryRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
        }

        public async Task<(double? Distance, double? Consumption)> CalculateAsync(Guid vehicleId, double odometer, double liters, CancellationToken ct)
        {
            var allEntries = await _fuelEntryRepository.GetByVehicleIdAsync(vehicleId);

            var previousEntries = allEntries
                .Where(e => e.OdometerReading < odometer)
                .OrderByDescending(e => e.OdometerReading)
                .ThenByDescending(e => e.Date)
                .ToList();

            var lastFullTankEntry = previousEntries
                .FirstOrDefault(e => e.IsFullTank);
            if (lastFullTankEntry is null)
                return (null, null);

            var distance = odometer - lastFullTankEntry.OdometerReading;
            if (distance <= 0)
                return (null, null);

            var litersUsed = previousEntries
                .Where(e => e.OdometerReading > lastFullTankEntry.OdometerReading)
                .Sum(e => e.Liters) + liters;

            var consumption = Math.Round((litersUsed / distance) * 100, 2);

            return (distance, consumption);
        }
    }
}
