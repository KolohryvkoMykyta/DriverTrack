using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByVehicleId
{
    public class GetFuelByVehicleIdQueryHandler : IRequestHandler<GetFuelByVehicleIdQuery, List<FuelEntryDto>>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IMapper _mapper;

        public GetFuelByVehicleIdQueryHandler(IFuelEntryRepository fuelEntryRepository, IMapper mapper)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _mapper = mapper;
        }

        public async Task<List<FuelEntryDto>> Handle(GetFuelByVehicleIdQuery request, CancellationToken cancellationToken)
        {
            var entries = await _fuelEntryRepository.GetByVehicleIdAsync(request.VehicleId, request.From, request.To, cancellationToken);

            return _mapper.Map<List<FuelEntryDto>>(entries);
        }
    }
}
