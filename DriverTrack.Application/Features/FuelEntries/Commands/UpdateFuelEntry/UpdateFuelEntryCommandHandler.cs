using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry
{
    public class UpdateFuelEntryCommandHandler : IRequestHandler<UpdateFuelEntryCommand, Unit>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IFuelEntriesRecalculationService _fuelEntriesRecalculationService;
        private readonly IVehicleAverageConsumptionCalculator _vehicleAverageConsumptionCalculator;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateFuelEntryCommandHandler(
            IFuelEntryRepository fuelEntryRepository,
            IVehicleRepository vehicleRepository,
            IFuelEntriesRecalculationService fuelEntriesRecalculationService,
            IVehicleAverageConsumptionCalculator vehicleAverageConsumptionCalculator,
            IUnitOfWork unitOfWork)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _vehicleRepository = vehicleRepository;
            _fuelEntriesRecalculationService = fuelEntriesRecalculationService;
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

            _fuelEntryRepository.Update(entry);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _fuelEntriesRecalculationService.RecalculateForVehicleAsync(
                entry.VehicleId,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var vehicle = await _vehicleRepository.GetByIdAsync(entry.VehicleId, cancellationToken);

            if (vehicle != null)
            {
                vehicle.AverageFuelConsumption =
                    await _vehicleAverageConsumptionCalculator.CalculateAsync(entry.VehicleId, cancellationToken);

                _vehicleRepository.Update(vehicle);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return Unit.Value;
        }
    }
}