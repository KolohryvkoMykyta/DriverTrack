using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.DeleteFuelEntry
{
    public class DeleteFuelEntryCommandHandler : IRequestHandler<DeleteFuelEntryCommand, Unit>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IFuelEntriesRecalculationService _fuelEntriesRecalculationService;
        private readonly IVehicleAverageConsumptionCalculator _vehicleAverageConsumptionCalculator;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFuelEntryCommandHandler(
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

        public async Task<Unit> Handle(DeleteFuelEntryCommand request, CancellationToken cancellationToken)
        {
            var entry = await _fuelEntryRepository.GetByIdAsync(request.Id, cancellationToken);

            if (entry is null)
                throw new NotFoundException(nameof(FuelEntry), request.Id);

            var vehicleId = entry.VehicleId;

            await _fuelEntryRepository.DeleteAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _fuelEntriesRecalculationService.RecalculateForVehicleAsync(
                vehicleId,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId, cancellationToken);

            if (vehicle != null)
            {
                vehicle.AverageFuelConsumption =
                    await _vehicleAverageConsumptionCalculator.CalculateAsync(vehicleId, cancellationToken);

                _vehicleRepository.Update(vehicle);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return Unit.Value;
        }
    }
}