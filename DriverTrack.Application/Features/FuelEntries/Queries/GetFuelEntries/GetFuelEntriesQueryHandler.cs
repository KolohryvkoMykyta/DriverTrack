using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntries
{
    public class GetFuelEntriesQueryHandler : IRequestHandler<GetFuelEntriesQuery, List<FuelEntryDto>>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IMapper _mapper;
        public GetFuelEntriesQueryHandler(IFuelEntryRepository fuelEntryRepository, IMapper mapper)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _mapper = mapper;
        }
        public async Task<List<FuelEntryDto>> Handle(GetFuelEntriesQuery request, CancellationToken cancellationToken)
        {
            var entries = await _fuelEntryRepository.GetWithFiltersAsync(
                request.DriverId,
                request.VehicleId,
                request.StartDate,
                request.EndDate,
                cancellationToken);
            return _mapper.Map<List<FuelEntryDto>>(entries);
        }
    }
}
