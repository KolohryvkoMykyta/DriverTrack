using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create;

public class CreateRouteCommandHandler
    : IRequestHandler<CreateRouteCommand, Guid>
{
    private readonly IRouteRepository _routeRepository;
    private readonly IRouteTypeRepository _routeTypeRepository;
    private readonly IDriverRepository _driverRepository;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUser _currentUser;

    public CreateRouteCommandHandler(
        IRouteRepository routeRepository,
        IRouteTypeRepository routeTypeRepository,
        IDriverRepository driverRepository,
        IVehicleRepository vehicleRepository,
        IUnitOfWork unitOfWork,
        ICurrentUser currentUser)
    {
        _routeRepository = routeRepository;
        _routeTypeRepository = routeTypeRepository;
        _driverRepository = driverRepository;
        _vehicleRepository = vehicleRepository;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Guid> Handle(
        CreateRouteCommand request,
        CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated ||
            _currentUser.UserId is null)
        {
            throw new UnauthorizedException(
                ErrorMessages.Auth.UserNotAuthorized);
        }

        if (!_currentUser.IsAdmin)
        {
            if (!_currentUser.IsDriver ||
                _currentUser.DriverId is not Guid driverId ||
                driverId != request.DriverId)
            {
                throw new ForbiddenException(
                    ErrorMessages.Route.AccessDenied);
            }

            var driver = await _driverRepository.GetByIdAsync(
                driverId,
                cancellationToken);

            if (driver is null || !driver.IsActive)
            {
                throw new ForbiddenException(
                    ErrorMessages.Drivers.InactiveOrUnavailable);
            }

            var vehicle = await _vehicleRepository.GetByIdAsync(
                request.VehicleId,
                cancellationToken);

            if (vehicle is null || vehicle.DriverId != driverId)
            {
                throw new ForbiddenException(
                    ErrorMessages.Vehicles.AccessDenied);
            }

            if (!vehicle.IsActive)
            {
                throw new BusinessException(
                    ErrorMessages.Vehicles.Inactive);
            }
        }

        var openRoute = await _routeRepository.GetOpenRouteAsync(
            request.DriverId,
            cancellationToken);

        if (openRoute is not null)
        {
            throw new BusinessException(
                ErrorMessages.Route.OpenAlreadyExists);
        }

        var routeType = await _routeTypeRepository.GetByIdAsync(
            request.RouteTypeId,
            cancellationToken);

        if (routeType is null)
        {
            throw new NotFoundException(
                nameof(RouteType),
                request.RouteTypeId);
        }

        var route = new RouteEntry
        {
            Id = Guid.NewGuid(),
            DriverId = request.DriverId,
            VehicleId = request.VehicleId,
            RouteTypeId = request.RouteTypeId,
            StartDate = request.StartDate,
            StartOdometer = request.StartOdometer,
            DriverPayment = routeType.DriverPayment,
            Revenue = routeType.Revenue
        };

        await _routeRepository.AddAsync(
            route,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return route.Id;
    }
}