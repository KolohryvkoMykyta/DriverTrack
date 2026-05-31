using AutoMapper;
using DriverTrack.Application.Common.Constants;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRouteById
{
    public class GetRouteByIdQueryHandler : IRequestHandler<GetRouteByIdQuery, RouteEntryDto>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IMapper _mapper;

        public GetRouteByIdQueryHandler(IRouteRepository routeRepository, IMapper mapper)
        {
            _routeRepository = routeRepository;
            _mapper = mapper;
        }

        public async Task<RouteEntryDto> Handle(GetRouteByIdQuery request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            return _mapper.Map<RouteEntryDto>(route);
        }
    }
}
