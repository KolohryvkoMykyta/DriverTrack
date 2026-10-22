using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.Statistics.Queries.GetDriverDashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/driver/dashboard")]
[Authorize(Roles = "Driver")]
public sealed class DriverDashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DriverDashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(DriverDashboardDto),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<DriverDashboardDto>> Get(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetDriverDashboardQuery(from, to),
            cancellationToken);

        return Ok(result);
    }
}