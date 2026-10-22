using AutoMapper;
using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetOpenRouteByDriver;

public class GetOpenRouteByDriverQueryHandler
    : IRequestHandler<GetOpenRouteByDriverQuery, RouteEntryDto?>
{
    private readonly IRouteRepository _repository;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;

    public GetOpenRouteByDriverQueryHandler(
        IRouteRepository repository,
        IMapper mapper,
        ICurrentUser currentUser)
    {
        _repository = repository;
        _mapper = mapper;
        _currentUser = currentUser;
    }

    public async Task<RouteEntryDto?> Handle(
        GetOpenRouteByDriverQuery request,
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
             _currentUser.DriverId is not Guid driverId ||
             driverId != request.DriverId))
        {
            throw new ForbiddenException(
                ErrorMessages.Route.AccessDenied);
        }

        var openRoute = await _repository.GetOpenRouteAsync(
            request.DriverId,
            cancellationToken);

        if (openRoute is null)
        {
            return null;
        }

        return _mapper.Map<RouteEntryDto>(openRoute);
    }
}