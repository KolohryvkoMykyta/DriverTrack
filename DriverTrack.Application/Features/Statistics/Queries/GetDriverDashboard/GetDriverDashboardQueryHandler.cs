using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using MediatR;

namespace DriverTrack.Application.Features.Statistics.Queries.GetDriverDashboard;

public sealed class GetDriverDashboardQueryHandler
    : IRequestHandler<GetDriverDashboardQuery, DriverDashboardDto>
{
    private readonly IRouteRepository _routeRepository;
    private readonly ICurrentUser _currentUser;

    public GetDriverDashboardQueryHandler(
        IRouteRepository routeRepository,
        ICurrentUser currentUser)
    {
        _routeRepository = routeRepository;
        _currentUser = currentUser;
    }

    public async Task<DriverDashboardDto> Handle(
        GetDriverDashboardQuery request,
        CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated ||
            _currentUser.UserId is null)
        {
            throw new UnauthorizedException(
                ErrorMessages.Auth.UserNotAuthorized);
        }

        if (!_currentUser.IsDriver ||
            _currentUser.DriverId is not Guid driverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Auth.DriverProfileRequired);
        }

        var routes = await _routeRepository.GetCompletedByDriverAsync(
            driverId,
            request.From,
            request.To,
            cancellationToken);

        var recentRoutes = routes
            .Select(route => new DriverDashboardRouteDto
            {
                Id = route.Id,

                RouteTypeName =
                    route.RouteType?.Name ?? string.Empty,

                VehicleName = route.Vehicle is null
                    ? string.Empty
                    : $"{route.Vehicle.Brand} {route.Vehicle.Model}",

                LicensePlate =
                    route.Vehicle?.LicensePlate ?? string.Empty,

                StartDate = DateTime.SpecifyKind(
                    route.StartDate,
                    DateTimeKind.Utc),

                EndDate = DateTime.SpecifyKind(
                    route.EndDate!.Value,
                    DateTimeKind.Utc),

                TotalDistance = route.TotalDistance ?? 0,

                DriverPayment = route.DriverPayment
            })
            .ToList();

        return new DriverDashboardDto
        {
            CompletedRouteCount = routes.Count,

            TotalDistance = routes.Sum(
                route => route.TotalDistance ?? 0),

            TotalDriverPayment = routes.Sum(
                route => route.DriverPayment),

            RecentRoutes = recentRoutes
        };
    }
}