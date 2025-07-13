using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry
{
    public class UpdateFuelEntryCommandHandler : IRequestHandler<UpdateFuelEntryCommand, Unit>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;

        public UpdateFuelEntryCommandHandler(IFuelEntryRepository fuelEntryRepository)
        {
            _fuelEntryRepository = fuelEntryRepository;
        }

        public async Task<Unit> Handle(UpdateFuelEntryCommand request, CancellationToken cancellationToken)
        {
            var entry = await _fuelEntryRepository.GetByIdAsync(request.Id);

            if (entry is null)
                throw new NotFoundException(nameof(FuelEntry), request.Id);

            entry.Date = request.Date;
            entry.OdometerReading = request.OdometerReading;
            entry.Liters = request.Liters;

            await _fuelEntryRepository.UpdateAsync(entry);

            return Unit.Value;
        }
    }
}
