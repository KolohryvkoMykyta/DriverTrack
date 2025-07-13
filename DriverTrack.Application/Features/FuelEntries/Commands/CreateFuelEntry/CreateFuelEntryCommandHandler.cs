using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public class CreateFuelEntryCommandHandler : IRequestHandler<CreateFuelEntryCommand, Guid>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;

        public CreateFuelEntryCommandHandler(IFuelEntryRepository fuelEntryRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
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

            await _fuelEntryRepository.AddAsync(entry);

            return entry.Id;
        }
    }
}
