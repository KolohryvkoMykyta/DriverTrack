using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntries;
using DriverTrack.Application.Interfaces.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/driver/fuel-entries")]
[Authorize(Roles = "Driver")]
public sealed class DriverFuelEntriesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUser _currentUser;

    public DriverFuelEntriesController(
        IMediator mediator,
        ICurrentUser currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<FuelEntryDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<FuelEntryDto>>> Get(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        CancellationToken cancellationToken)
    {
        if (_currentUser.DriverId is not Guid driverId)
        {
            throw new ForbiddenException(
                ErrorMessages.Auth.DriverProfileRequired);
        }

        var entries = await _mediator.Send(
            new GetFuelEntriesQuery(
                driverId,
                null,
                from,
                to),
            cancellationToken);

        return Ok(entries);
    }
}