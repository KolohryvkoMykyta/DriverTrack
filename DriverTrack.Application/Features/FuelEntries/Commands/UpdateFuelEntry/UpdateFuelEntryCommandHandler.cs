using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry
{
    public class UpdateFuelEntryCommandHandler : IRequestHandler<UpdateFuelEntryCommand, Unit>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IFuelConsumptionCalculator _consumptionCalculator;
        private readonly IVehicleAverageConsumptionCalculator _vehicleAverageConsumptionCalculator;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateFuelEntryCommandHandler(
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

        public async Task<Unit> Handle(UpdateFuelEntryCommand request, CancellationToken cancellationToken)
        {
            var entry = await _fuelEntryRepository.GetByIdAsync(request.Id, cancellationToken);

            if (entry is null)
                throw new NotFoundException(nameof(FuelEntry), request.Id);

            entry.Date = request.Date;
            entry.OdometerReading = request.OdometerReading;
            entry.Liters = request.Liters;
            entry.IsFullTank = request.IsFullTank;

            if (entry.IsFullTank)
            {
                var (Distance, Consumption) = await _consumptionCalculator.CalculateAsync(
                    entry.VehicleId,
                    request.OdometerReading,
                    request.Liters,
                    cancellationToken
                );

                entry.DistanceSinceLastRefuel = Distance;
                entry.FuelConsumption = Consumption;
            }
            else 
            {
                entry.DistanceSinceLastRefuel = null;
                entry.FuelConsumption = null;
            }

            _fuelEntryRepository.Update(entry);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (entry.IsFullTank)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(entry.VehicleId, cancellationToken);

                if (vehicle != null)
                {
                    vehicle.AverageFuelConsumption = await _vehicleAverageConsumptionCalculator.CalculateAsync(entry.VehicleId, cancellationToken);

                    _vehicleRepository.Update(vehicle);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
            }

            return Unit.Value;
        }
    }
}
