using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public class CreateFuelEntryCommandHandler : IRequestHandler<CreateFuelEntryCommand, Guid>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IVehicleRepository _vehicleRepository;

        public CreateFuelEntryCommandHandler(IFuelEntryRepository fuelEntryRepository, IVehicleRepository vehicleRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _vehicleRepository = vehicleRepository;
        }

        public async Task<Guid> Handle(CreateFuelEntryCommand request, CancellationToken cancellationToken)
        {
            var consumption = await CalculateFuelConsumptionAsync(
                request.VehicleId,
                request.OdometerReading,
                request.Liters
            );

            var entry = new FuelEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                Date = request.Date,
                OdometerReading = request.OdometerReading,
                Liters = request.Liters,
                FuelConsumption = consumption
            };

            await _fuelEntryRepository.AddAsync(entry);
            
            await UpdateAverageFuelConsumptionAsync(request.VehicleId);

            return entry.Id;
        }

        private async Task<double?> CalculateFuelConsumptionAsync(Guid vehicleId, double currentOdometer, double liters)
        {
            var previous = await _fuelEntryRepository.GetPreviousFuelEntryAsync(vehicleId, currentOdometer);

            if (previous is not null)
            {
                var distance = currentOdometer - previous.OdometerReading;

                if (distance > 0)
                {
                    return (liters / distance) * 100;
                }
            }

            return null;
        }

        private async Task UpdateAverageFuelConsumptionAsync(Guid vehicleId)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);

            if (vehicle is null)
                return;

            var entries = await _fuelEntryRepository.GetByVehicleIdAsync(vehicleId);
            
            var validConsumptions = entries
                .Where(e => e.FuelConsumption.HasValue)
                .Select(e => e.FuelConsumption!.Value)
                .ToList();

            if (validConsumptions.Any())
            {
                var average = validConsumptions.Average();

                vehicle.AverageFuelConsumption = average;

                await _vehicleRepository.UpdateAsync(vehicle);
            }
        }
    }
}
