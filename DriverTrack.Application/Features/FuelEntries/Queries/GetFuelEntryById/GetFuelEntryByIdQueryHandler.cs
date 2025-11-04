using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntryById
{
    public class GetFuelEntryByIdQueryHandler : IRequestHandler<GetFuelEntryByIdQuery, FuelEntryDto?>
    {
        private readonly IVehicleRepository _repository;
        private readonly IMapper _mapper;

        public GetFuelEntryByIdQueryHandler(IVehicleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<FuelEntryDto?> Handle(GetFuelEntryByIdQuery request, CancellationToken cancellationToken)
        {
            var entry = await _repository.GetByIdAsync(request.Id, cancellationToken);

            return entry is null ? null : _mapper.Map<FuelEntryDto>(entry);
        }
    }
}
