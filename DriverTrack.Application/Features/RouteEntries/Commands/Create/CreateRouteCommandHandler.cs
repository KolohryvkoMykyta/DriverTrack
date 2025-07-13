using DriverTrack.Application.Common.Constants;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create
{
    public class CreateRouteCommandHandler : IRequestHandler<CreateRouteCommand, Guid>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTypeRepository _routeTypeRepository;

        public CreateRouteCommandHandler(
            IRouteRepository routeRepository,
            IRouteTypeRepository routeTypeRepository)
        {
            _routeRepository = routeRepository;
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Guid> Handle(CreateRouteCommand request, CancellationToken cancellationToken)
        {
            var openRoute = await _routeRepository.GetOpenRouteAsync(request.DriverId);

            if (openRoute is not null)
                throw new BusinessException(ErrorMessages.OpenRouteExists);

            var routeType = await _routeTypeRepository.GetByIdAsync(request.RouteTypeId);
            
            if (routeType == null)
                throw new NotFoundException(nameof(RouteType), request.RouteTypeId);

            var route = new RouteEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                RouteTypeId = request.RouteTypeId,
                StartDate = request.StartDate,
                StartOdometer = request.StartOdometer,
                Earnings = routeType.Earnings
            };

            await _routeRepository.AddAsync(route);
            
            return route.Id;
        }
    }
}
