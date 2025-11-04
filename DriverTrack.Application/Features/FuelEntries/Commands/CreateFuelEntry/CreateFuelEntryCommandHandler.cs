using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public class CreateFuelEntryCommandHandler : IRequestHandler<CreateFuelEntryCommand, Guid>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IFuelConsumptionCalculator _consumptionCalculator;
        private readonly IVehicleAverageConsumptionCalculator _vehicleAverageConsumptionCalculator;
        private readonly IUnitOfWork _unitOfWork;

        public CreateFuelEntryCommandHandler(
            IFuelEntryRepository fuelEntryRepository, 
            IVehicleRepository vehicleRepository, 
            IFuelConsumptionCalculator consumptionCalculator, 
            IVehicleAverageConsumptionCalculator vehicleAverageConsumptionCalculator,
            IUnitOfWork unitOfWork)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _vehicleRepository = vehicleRepository;
            _consumptionCalculator = consumptionCalculator;
            _vehicleAverageConsumptionCalculator = vehicleAverageConsumptionCalculator;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateFuelEntryCommand request, CancellationToken cancellationToken)
        {

            var entry = new FuelEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                Date = request.Date,
                OdometerReading = request.OdometerReading,
                Liters = request.Liters
            };

            if (request.IsFullTank)
            {
                var (Distance, Consumption) = await _consumptionCalculator.CalculateAsync(
                    request.VehicleId,
                    request.OdometerReading,
                    request.Liters,
                    cancellationToken
                );

                entry.DistanceSinceLastRefuel = Distance;
                entry.FuelConsumption = Consumption;
            }

            await _fuelEntryRepository.AddAsync(entry, cancellationToken);

            if (request.IsFullTank)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken);
                
                if (vehicle != null)
                {
                    vehicle.AverageFuelConsumption = await _vehicleAverageConsumptionCalculator.CalculateAsync(request.VehicleId, cancellationToken);
                    
                    _vehicleRepository.Update(vehicle);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return entry.Id;
        }
    }
}
