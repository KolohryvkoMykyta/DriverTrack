using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Queries.GetCurrentFuelPrice
{
    public sealed class GetCurrentFuelPriceQueryHandler
        : IRequestHandler<GetCurrentFuelPriceQuery, FuelPriceDto?>
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IMapper _mapper;

        public GetCurrentFuelPriceQueryHandler(
            IFuelPriceRepository fuelPriceRepository,
            IMapper mapper)
        {
            _fuelPriceRepository = fuelPriceRepository;
            _mapper = mapper;
        }

        public async Task<FuelPriceDto?> Handle(
            GetCurrentFuelPriceQuery request,
            CancellationToken cancellationToken)
        {
            var fuelPrice = await _fuelPriceRepository.GetCurrentPriceAsync(
                request.Date,
                cancellationToken);

            return _mapper.Map<FuelPriceDto?>(fuelPrice);
        }
    }
}