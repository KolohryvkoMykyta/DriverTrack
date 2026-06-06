using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.DeleteFuelPrice
{
    public sealed class DeleteFuelPriceCommandHandler
        : IRequestHandler<DeleteFuelPriceCommand>
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFuelPriceCommandHandler(
            IFuelPriceRepository fuelPriceRepository,
            IUnitOfWork unitOfWork)
        {
            _fuelPriceRepository = fuelPriceRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(
            DeleteFuelPriceCommand request,
            CancellationToken cancellationToken)
        {
            var fuelPrice = await _fuelPriceRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (fuelPrice is null)
            {
                throw new NotFoundException(nameof(FuelPrice), request.Id);
            }

            await _fuelPriceRepository.DeleteAsync(request.Id, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}