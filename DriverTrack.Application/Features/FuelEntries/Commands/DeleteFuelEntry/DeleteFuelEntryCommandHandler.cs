using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.DeleteFuelEntry
{
    public class DeleteFuelEntryCommandHandler : IRequestHandler<DeleteFuelEntryCommand, Unit>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFuelEntryCommandHandler(IFuelEntryRepository fuelEntryRepository, IUnitOfWork unitOfWork)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteFuelEntryCommand request, CancellationToken cancellationToken)
        {
            var entry = await _fuelEntryRepository.GetByIdAsync(request.Id, cancellationToken);

            if (entry is null)
                throw new NotFoundException(nameof(FuelEntry), request.Id);

            await _fuelEntryRepository.DeleteAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
