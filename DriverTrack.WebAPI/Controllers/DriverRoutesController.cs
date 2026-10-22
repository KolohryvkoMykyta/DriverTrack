using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Features.RouteEntries.Commands.Create;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.WebAPI.Contracts.DriverRoutes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DriverTrack.Application.Features.RouteEntries.Queries.GetOpenRouteByDriver;
using DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/driver/routes")]
[Authorize(Roles = "Driver")]
public sealed class DriverRoutesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUser _currentUser;

    public DriverRoutesController(
        IMediator mediator,
        ICurrentUser currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [HttpPost("open")]
    public async Task<ActionResult<Guid>> Open(
        [FromBody] OpenDriverRouteRequest request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.DriverId is not Guid driverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Auth.DriverProfileRequired);
        }

        var command = new CreateRouteCommand(
            driverId,
            request.VehicleId,
            request.RouteTypeId,
            request.StartDate,
            request.StartOdometer);

        var routeId = await _mediator.Send(
            command,
            cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            routeId);
    }

    [HttpGet("open")]
    [ProducesResponseType(typeof(OpenDriverRouteResponse),StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult<OpenDriverRouteResponse>> GetOpen(
    CancellationToken cancellationToken)
    {
        if (_currentUser.DriverId is not Guid driverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Auth.DriverProfileRequired);
        }

        var route = await _mediator.Send(
            new GetOpenRouteByDriverQuery(driverId),
            cancellationToken);

        if (route is null)
        {
            return NoContent();
        }

        return Ok(new OpenDriverRouteResponse(
            route.Id,
            route.VehicleId,
            route.RouteTypeId,
            DateTime.SpecifyKind(route.StartDate, DateTimeKind.Utc),
            route.StartOdometer,
            route.DriverPayment));
    }

    [HttpPut("{id:guid}/close")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Close(
    Guid id,
    [FromBody] CloseDriverRouteRequest request,
    CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new CloseRouteCommand(
                id,
                request.EndOdometer,
                request.EndDate),
            cancellationToken);

        return NoContent();
    }
}