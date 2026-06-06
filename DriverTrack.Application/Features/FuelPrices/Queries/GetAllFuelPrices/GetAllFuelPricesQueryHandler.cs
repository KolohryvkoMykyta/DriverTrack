using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Queries.GetAllFuelPrices
{
    public sealed class GetAllFuelPricesQueryHandler
        : IRequestHandler<GetAllFuelPricesQuery, List<FuelPriceDto>>
    {
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IMapper _mapper;

        public GetAllFuelPricesQueryHandler(
            IFuelPriceRepository fuelPriceRepository,
            IMapper mapper)
        {
            _fuelPriceRepository = fuelPriceRepository;
            _mapper = mapper;
        }

        public async Task<List<FuelPriceDto>> Handle(
            GetAllFuelPricesQuery request,
            CancellationToken cancellationToken)
        {
            var fuelPrices = await _fuelPriceRepository.GetAllAsync(cancellationToken);

            return _mapper.Map<List<FuelPriceDto>>(fuelPrices);
        }
    }
}