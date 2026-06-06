using AutoMapper;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.UpdateFuelPrice
{
    public sealed class UpdateFuelPriceCommandHandler
        : IRequestHandler<UpdateFuelPriceCommand, FuelPriceDto>
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateFuelPriceCommandHandler(
            IFuelPriceRepository fuelPriceRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _fuelPriceRepository = fuelPriceRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<FuelPriceDto> Handle(
            UpdateFuelPriceCommand request,
            CancellationToken cancellationToken)
        {
            var fuelPrice = await _fuelPriceRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (fuelPrice is null)
            {
                throw new NotFoundException(nameof(FuelPrice), request.Id);
            }

            fuelPrice.PricePerLiter = request.PricePerLiter;
            fuelPrice.EffectiveFrom = request.EffectiveFrom;

            _fuelPriceRepository.Update(fuelPrice);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<FuelPriceDto>(fuelPrice);
        }
    }
}