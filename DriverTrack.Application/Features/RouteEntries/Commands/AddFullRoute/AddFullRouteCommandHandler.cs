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

namespace DriverTrack.Application.Features.RouteEntries.Commands.AddFullRoute
{
    public class AddFullRouteCommandHandler : IRequestHandler<AddFullRouteCommand, Guid>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IVehicleRepository _vehicleRepository;

        public AddFullRouteCommandHandler(
            IRouteRepository routeRepository, 
            IRouteTypeRepository routeTypeRepository, 
            IVehicleRepository vehicleRepository)
        {
            _routeRepository = routeRepository;
            _routeTypeRepository = routeTypeRepository;
            _vehicleRepository = vehicleRepository;
        }

        public async Task<Guid> Handle(AddFullRouteCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.RouteTypeId);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.RouteTypeId);

            var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);
            
            if (vehicle is null)
                throw new NotFoundException(nameof(Vehicle), request.VehicleId);

            var totalDistance = request.TotalDistance ?? (request.EndOdometer - request.StartOdometer);

            double? fuelUsed = null;

            if (vehicle.AverageFuelConsumption is not null && totalDistance > 0)
                fuelUsed = Math.Round(vehicle.AverageFuelConsumption.Value * totalDistance / 100.0, 2);

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
                Earnings = routeType.Earnings,
                TotalDistance = totalDistance,
                FuelUsed = fuelUsed
            };

            await _routeRepository.AddAsync(route);

            return route.Id;
        }
    }
}
