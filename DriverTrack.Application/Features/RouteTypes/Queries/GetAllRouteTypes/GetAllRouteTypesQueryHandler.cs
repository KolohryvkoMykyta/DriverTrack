using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteTypes.Queries.GetAllRouteTypes
{
    public class GetAllRouteTypesQueryHandler : IRequestHandler<GetAllRouteTypesQuery, List<RouteTypeDto>>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IMapper _mapper;

        public GetAllRouteTypesQueryHandler(IRouteTypeRepository routeTypeRepository, IMapper mapper)
        {
            _routeTypeRepository = routeTypeRepository;
            _mapper = mapper;
        }

        public async Task<List<RouteTypeDto>> Handle(GetAllRouteTypesQuery request, CancellationToken cancellationToken)
        {
            var routeTypes = await _routeTypeRepository.GetAllAsync(cancellationToken);

            return _mapper.Map<List<RouteTypeDto>>(routeTypes);
        }
    }
}
