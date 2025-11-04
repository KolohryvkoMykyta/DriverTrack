using DriverTrack.Application.Common.Constants;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute
{
    public class CloseRouteCommandHandler : IRequestHandler<CloseRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IVehicleRepository _vehicleRepository;

        public CloseRouteCommandHandler(IRouteRepository repository, IVehicleRepository vehicleRepository)
        {
            _routeRepository = repository;
            _vehicleRepository = vehicleRepository;
        }

        public async Task<Unit> Handle(CloseRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.RouteId);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.RouteId);

            if (route.EndDate is not null)
                throw new BusinessException(ErrorMessages.RouteAlreadyClosed);

            route.EndOdometer = request.EndOdometer;
            route.EndDate = request.EndDate ?? DateTime.UtcNow;

            if (route.EndOdometer is not null)
                route.TotalDistance = route.EndOdometer - route.StartOdometer;

            if (route.TotalDistance is not null)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(route.VehicleId);
                if (vehicle is null)
                    throw new NotFoundException(nameof(Vehicle), route.VehicleId);

                if (vehicle.AverageFuelConsumption is not null && route.TotalDistance!.Value > 0)
                {
                    route.FuelUsed = Math.Round(
                        route.TotalDistance!.Value * vehicle.AverageFuelConsumption!.Value / 100.0,
                        2);
                }
                else
                {
                    route.FuelUsed = null;
                }
            }

            await _routeRepository.UpdateAsync(route);

            return Unit.Value;
        }
    }
}
