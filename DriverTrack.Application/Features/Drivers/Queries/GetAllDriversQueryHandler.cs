using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public class GetAllDriversQueryHandler
        : IRequestHandler<GetAllDriversQuery, List<DriverListItemDto>>
    {
        private readonly IDriverRepository _repository;
        private readonly IMapper _mapper;

        public GetAllDriversQueryHandler(
            IDriverRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<DriverListItemDto>> Handle(
            GetAllDriversQuery request,
            CancellationToken cancellationToken)
        {
            var drivers =
                await _repository.GetAllWithActiveVehiclesAsync(
                    cancellationToken);

            return _mapper.Map<List<DriverListItemDto>>(drivers);
        }
    }
}