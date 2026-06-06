using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.CreateFuelPrice
{
    public sealed class CreateFuelPriceCommandHandler
        : IRequestHandler<CreateFuelPriceCommand, FuelPriceDto>
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateFuelPriceCommandHandler(
            IFuelPriceRepository fuelPriceRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _fuelPriceRepository = fuelPriceRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<FuelPriceDto> Handle(
            CreateFuelPriceCommand request,
            CancellationToken cancellationToken)
        {
            var fuelPrice = new FuelPrice
            {
                Id = Guid.NewGuid(),
                PricePerLiter = request.PricePerLiter,
                EffectiveFrom = request.EffectiveFrom
            };

            await _fuelPriceRepository.AddAsync(fuelPrice, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<FuelPriceDto>(fuelPrice);
        }
    }
}