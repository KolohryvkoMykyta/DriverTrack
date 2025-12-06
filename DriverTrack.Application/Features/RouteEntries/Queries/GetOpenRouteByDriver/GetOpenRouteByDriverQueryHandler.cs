using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetOpenRouteByDriver
{
    public class GetOpenRouteByDriverQueryHandler : IRequestHandler<GetOpenRouteByDriverQuery, RouteEntryDto?>
    {
        private readonly IRouteRepository _repository;
        private readonly IMapper _mapper;

        public GetOpenRouteByDriverQueryHandler(IRouteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<RouteEntryDto?> Handle(GetOpenRouteByDriverQuery request, CancellationToken cancellationToken)
        {
            var openRoute = await _repository.GetOpenRouteAsync(request.DriverId, cancellationToken);

            if (openRoute is null)
                return null;

            return _mapper.Map<RouteEntryDto>(openRoute);
        }
    }
}
