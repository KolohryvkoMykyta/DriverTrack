using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Infrastructure.Services
{
    public class FuelCostCalculator : IFuelCostCalculator
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;

        public FuelCostCalculator(
            IFuelPriceRepository fuelPriceRepository)
        {
            _fuelPriceRepository = fuelPriceRepository;
        }

        public async Task<decimal> CalculateAsync(
            IEnumerable<FuelEntry> fuelEntries,
            CancellationToken cancellationToken = default)
        {
            decimal total = 0m;

            foreach (var fuelEntry in fuelEntries)
            {
                var fuelPrice =
                    await _fuelPriceRepository.GetCurrentPriceAsync(
                        fuelEntry.Date,
                        cancellationToken);

                if (fuelPrice is null)
                    continue;

                total +=
                    (decimal)fuelEntry.Liters *
                    fuelPrice.PricePerLiter;
            }

            return total;
        }
    }
}
