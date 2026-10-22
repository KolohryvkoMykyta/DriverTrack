using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Features.Vehicles.Queries.GetVehiclesByDriver;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.WebAPI.Contracts.DriverVehicles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/driver/vehicles")]
[Authorize(Roles = "Driver")]
public sealed class DriverVehiclesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUser _currentUser;

    public DriverVehiclesController(
        IMediator mediator,
        ICurrentUser currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<DriverVehicleResponse>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<DriverVehicleResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        if (_currentUser.DriverId is not Guid driverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Auth.DriverProfileRequired);
        }

        var vehicles = await _mediator.Send(
            new GetVehiclesByDriverQuery(driverId),
            cancellationToken);

        var response = vehicles
            .Where(vehicle => vehicle.IsActive)
            .OrderBy(vehicle => vehicle.Brand)
            .ThenBy(vehicle => vehicle.Model)
            .ThenBy(vehicle => vehicle.LicensePlate)
            .Select(vehicle => new DriverVehicleResponse(
                vehicle.Id,
                vehicle.Brand,
                vehicle.Model,
                vehicle.LicensePlate,
                vehicle.AverageFuelConsumption))
            .ToList();

        return Ok(response);
    }
}