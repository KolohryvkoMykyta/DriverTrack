using AutoMapper;
using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Queries.GetVehiclesByDriver;

public class GetVehiclesByDriverQueryHandler
    : IRequestHandler<GetVehiclesByDriverQuery, List<VehicleDto>>
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;

    public GetVehiclesByDriverQueryHandler(
        IVehicleRepository vehicleRepository,
        IMapper mapper,
        ICurrentUser currentUser)
    {
        _vehicleRepository = vehicleRepository;
        _mapper = mapper;
        _currentUser = currentUser;
    }

    public async Task<List<VehicleDto>> Handle(
        GetVehiclesByDriverQuery request,
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
                ErrorMessages.Vehicles.AccessDenied);
        }

        var vehicles = await _vehicleRepository.GetByDriverIdAsync(
            request.DriverId,
            cancellationToken);

        return _mapper.Map<List<VehicleDto>>(vehicles);
    }
}