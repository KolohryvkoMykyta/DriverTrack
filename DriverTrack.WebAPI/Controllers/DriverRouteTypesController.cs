using DriverTrack.Application.Features.RouteTypes.Queries.GetAllRouteTypes;
using DriverTrack.WebAPI.Contracts.DriverRouteTypes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/driver/route-types")]
[Authorize(Roles = "Driver")]
public sealed class DriverRouteTypesController : ControllerBase
{
    private readonly IMediator _mediator;

    public DriverRouteTypesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<DriverRouteTypeResponse>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<DriverRouteTypeResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var routeTypes = await _mediator.Send(
            new GetAllRouteTypesQuery(),
            cancellationToken);

        var response = routeTypes
            .OrderBy(routeType => routeType.Name)
            .Select(routeType => new DriverRouteTypeResponse(
                routeType.Id,
                routeType.Name,
                routeType.DriverPayment))
            .ToList();

        return Ok(response);
    }
}