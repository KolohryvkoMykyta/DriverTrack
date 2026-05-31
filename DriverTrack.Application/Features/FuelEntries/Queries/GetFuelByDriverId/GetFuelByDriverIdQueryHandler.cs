using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByDriverId
{
    public class GetFuelByDriverIdQueryHandler : IRequestHandler<GetFuelByDriverIdQuery, List<FuelEntryDto>>
    {
        private readonly IFuelEntryRepository _fuelEntryRepository;
        private readonly IMapper _mapper;

        public GetFuelByDriverIdQueryHandler(IFuelEntryRepository fuelEntryRepository, IMapper mapper)
        {
            _fuelEntryRepository = fuelEntryRepository;
            _mapper = mapper;
        }

        public async Task<List<FuelEntryDto>> Handle(GetFuelByDriverIdQuery request, CancellationToken cancellationToken)
        {
            var entries = await _fuelEntryRepository.GetByDriverIdAsync(request.DriverId, request.From, request.To, cancellationToken);

            return _mapper.Map<List<FuelEntryDto>>(entries);
        }
    }
}
