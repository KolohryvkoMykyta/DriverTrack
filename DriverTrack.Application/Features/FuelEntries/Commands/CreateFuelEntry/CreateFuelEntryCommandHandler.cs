using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
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
        private readonly IDriverRepository _driverRepository;
        private readonly IFuelConsumptionCalculator _consumptionCalculator;
        private readonly IVehicleAverageConsumptionCalculator _vehicleAverageConsumptionCalculator;
        private readonly IUnitOfWork _unitOfWork;

        public CreateFuelEntryCommandHandler(
            IFuelEntryRepository fuelEntryRepository, 
            IVehicleRepository vehicleRepository,
            IDriverRepository driverRepository,
            IFuelConsumptionCalculator consumptionCalculator, 
            IVehicleAverageConsumptionCalculator vehicleAverageConsumptionCalculator,
            IUnitOfWork unitOfWork)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _vehicleRepository = vehicleRepository;
            _driverRepository = driverRepository;
            _consumptionCalculator = consumptionCalculator;
            _vehicleAverageConsumptionCalculator = vehicleAverageConsumptionCalculator;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateFuelEntryCommand request, CancellationToken cancellationToken)
        {
            if (await _driverRepository.GetByIdAsync(request.DriverId, cancellationToken) is null)
                throw new BusinessException(ErrorMessages.FuelEntries.DriverNotFoundById(request.DriverId));

            if (await _vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken) is null)
                throw new BusinessException(ErrorMessages.FuelEntries.VehicleNotFoundById(request.VehicleId));


            var entry = new FuelEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                Date = request.Date,
                OdometerReading = request.OdometerReading,
                Liters = request.Liters,
                IsFullTank = request.IsFullTank
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
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (request.IsFullTank)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId, cancellationToken);
                
                if (vehicle != null)
                {
                    vehicle.AverageFuelConsumption = await _vehicleAverageConsumptionCalculator.CalculateAsync(request.VehicleId, cancellationToken);
                    
                    _vehicleRepository.Update(vehicle);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
            }

            return entry.Id;
        }
    }
}
