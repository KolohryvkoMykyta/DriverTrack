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
        private readonly IUnitOfWork _unitOfWork;

        public UpdateFuelEntryCommandHandler(IFuelEntryRepository fuelEntryRepository, IUnitOfWork unitOfWork)
        {
            _fuelEntryRepository = fuelEntryRepository;
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

            return Unit.Value;
        }
    }
}
