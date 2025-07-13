using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.UpdateRoute
{
    public class UpdateRouteCommandHandler : IRequestHandler<UpdateRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTypeRepository _routeTypeRepository;

        public UpdateRouteCommandHandler(IRouteRepository routeRepository, IRouteTypeRepository routeTypeRepository)
        {
            _routeRepository = routeRepository;
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Unit> Handle(UpdateRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            var routeType = await _routeTypeRepository.GetByIdAsync(request.RouteTypeId);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.RouteTypeId);

            route.VehicleId = request.VehicleId;
            route.RouteTypeId = request.RouteTypeId;
            route.StartDate = request.StartDate;
            route.StartOdometer = request.StartOdometer;
            route.EndDate = request.EndDate;
            route.EndOdometer = request.EndOdometer;

            route.Earnings = request.Earnings ?? routeType.Earnings;

            await _routeRepository.UpdateAsync(route);

            return Unit.Value;
        }
    }
}
