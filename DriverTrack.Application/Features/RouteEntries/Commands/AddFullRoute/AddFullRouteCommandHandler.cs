using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.AddFullRoute
{
    public class AddFullRouteCommandHandler : IRequestHandler<AddFullRouteCommand, Guid>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTypeRepository _routeTypeRepository;

        public AddFullRouteCommandHandler(IRouteRepository routeRepository, IRouteTypeRepository routeTypeRepository)
        {
            _routeRepository = routeRepository;
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Guid> Handle(AddFullRouteCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.RouteTypeId);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.RouteTypeId);

            var route = new RouteEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                RouteTypeId = request.RouteTypeId,
                StartDate = request.StartDate,
                StartOdometer = request.StartOdometer,
                EndDate = request.EndDate,
                EndOdometer = request.EndOdometer,
                Earnings = routeType.Earnings
            };

            route.TotalDistance = request.TotalDistance ?? (request.EndOdometer - request.StartOdometer);

            await _routeRepository.AddAsync(route);

            return route.Id;
        }
    }
}
