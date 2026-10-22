using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute;

public class CloseRouteCommandHandler
    : IRequestHandler<CloseRouteCommand, Unit>
{
    private readonly IRouteRepository _routeRepository;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUser _currentUser;

    public CloseRouteCommandHandler(
        IRouteRepository routeRepository,
        IVehicleRepository vehicleRepository,
        IUnitOfWork unitOfWork,
        ICurrentUser currentUser)
    {
        _routeRepository = routeRepository;
        _vehicleRepository = vehicleRepository;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(
        CloseRouteCommand request,
        CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated ||
            _currentUser.UserId is null)
        {
            throw new UnauthorizedException(
                ErrorMessages.Auth.UserNotAuthorized);
        }

        if (!_currentUser.IsAdmin &&
            (!_currentUser.IsDriver ||
             _currentUser.DriverId is null))
        {
            throw new ForbiddenException(
                ErrorMessages.Route.AccessDenied);
        }

        var route = await _routeRepository.GetByIdAsync(
            request.RouteId,
            cancellationToken);

        if (route is null)
        {
            throw new NotFoundException(
                nameof(RouteEntry),
                request.RouteId);
        }

        if (!_currentUser.IsAdmin &&
            route.DriverId != _currentUser.DriverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Route.AccessDenied);
        }

        if (route.EndDate is not null)
        {
            throw new BusinessException(
                ErrorMessages.Route.AlreadyClosed);
        }

        var endDate = request.EndDate ?? DateTime.UtcNow;

        if (request.EndOdometer < route.StartOdometer)
        {
            throw new BusinessException(
                ErrorMessages.Route.EndOdometerBeforeStart);
        }

        if (endDate < route.StartDate)
        {
            throw new BusinessException(
                ErrorMessages.Route.EndDateBeforeStart);
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(
            route.VehicleId,
            cancellationToken);

        if (vehicle is null)
        {
            throw new NotFoundException(
                nameof(Vehicle),
                route.VehicleId);
        }

        var totalDistance =
            request.EndOdometer - route.StartOdometer;

        double? fuelUsed = null;

        if (vehicle.AverageFuelConsumption is double consumption &&
            totalDistance > 0)
        {
            fuelUsed = Math.Round(
                totalDistance * consumption / 100.0,
                2);
        }

        route.EndOdometer = request.EndOdometer;
        route.EndDate = endDate;
        route.TotalDistance = totalDistance;
        route.FuelUsed = fuelUsed;

        _routeRepository.Update(route);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}