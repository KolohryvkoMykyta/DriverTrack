using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public class GetRoutesQueryHandler : IRequestHandler<GetRoutesQuery, List<RouteEntryDto>>
    {
        private readonly IRouteRepository _repository;
        private readonly IMapper _mapper;

        public GetRoutesQueryHandler(IRouteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<RouteEntryDto>> Handle(GetRoutesQuery request, CancellationToken cancellationToken)
        {
            var routes = await _repository.GetWithFiltersAsync(request.DriverId, request.FromDate, request.ToDate, cancellationToken);

            return _mapper.Map<List<RouteEntryDto>>(routes);
        }
    }
}
