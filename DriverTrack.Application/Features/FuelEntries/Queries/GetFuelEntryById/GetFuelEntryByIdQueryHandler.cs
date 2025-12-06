using AutoMapper;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntryById
{
    public class GetFuelEntryByIdQueryHandler : IRequestHandler<GetFuelEntryByIdQuery, FuelEntryDto>
    {
        private readonly IVehicleRepository _repository;
        private readonly IMapper _mapper;

        public GetFuelEntryByIdQueryHandler(IVehicleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<FuelEntryDto> Handle(GetFuelEntryByIdQuery request, CancellationToken cancellationToken)
        {
            var entry = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (entry == null)
                throw new NotFoundException(nameof(FuelEntry), request.Id);

            return _mapper.Map<FuelEntryDto>(entry);
        }
    }
}
