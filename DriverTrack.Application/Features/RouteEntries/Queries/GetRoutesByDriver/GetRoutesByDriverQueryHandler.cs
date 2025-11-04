using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public class GetRoutesByDriverQueryHandler : IRequestHandler<GetRoutesByDriverQuery, List<RouteEntryDto>>
    {
        private readonly IRouteRepository _repository;
        private readonly IMapper _mapper;

        public GetRoutesByDriverQueryHandler(IRouteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<RouteEntryDto>> Handle(GetRoutesByDriverQuery request, CancellationToken cancellationToken)
        {
            var routes = await _repository.GetByDriverIdWithDateFilterAsync(request.DriverId, request.From, request.To, cancellationToken);
            return _mapper.Map<List<RouteEntryDto>>(routes);
        }
    }
}
