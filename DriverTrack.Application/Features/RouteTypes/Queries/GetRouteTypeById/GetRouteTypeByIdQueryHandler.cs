using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Queries.GetRouteTypeById
{
    public class GetRouteTypeByIdQueryHandler : IRequestHandler<GetRouteTypeByIdQuery, RouteTypeDto?>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IMapper _mapper;

        public GetRouteTypeByIdQueryHandler(IRouteTypeRepository routeTypeRepository, IMapper mapper)
        {
            _routeTypeRepository = routeTypeRepository;
            _mapper = mapper;
        }

        public async Task<RouteTypeDto?> Handle(GetRouteTypeByIdQuery request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.Id, cancellationToken);

            return routeType is null
                ? null
                : _mapper.Map<RouteTypeDto>(routeType);
        }
    }
}
