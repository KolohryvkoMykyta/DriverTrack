using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.RouteEntries.Commands.AddFullRoute;
using DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute;
using DriverTrack.Application.Features.RouteEntries.Commands.Create;
using DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute;
using DriverTrack.Application.Features.RouteEntries.Commands.UpdateRoute;
using DriverTrack.Application.Features.RouteEntries.Queries.GetOpenRouteByDriver;
using DriverTrack.Application.Features.RouteEntries.Queries.GetRouteById;
using DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver;
using DriverTrack.WebAPI.Contracts.RouteEntries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RouteEntriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RouteEntriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RouteEntryDto>> GetById(Guid id, CancellationToken ct)
        {
            var route = await _mediator.Send(new GetRouteByIdQuery(id), ct);

            return Ok(route);
        }

        [HttpGet("open")]
        public async Task<ActionResult<RouteEntryDto>> GetOpenByDriver([FromQuery] Guid driverId, CancellationToken ct)
        {
            var openRoute = await _mediator.Send(new GetOpenRouteByDriverQuery(driverId), ct);

            if (openRoute is null)
                return NoContent();

            return Ok(openRoute);
        }

        [HttpGet]
        public async Task<ActionResult<List<RouteEntryDto>>> GetRoutes(
            [FromQuery] Guid? driverId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            CancellationToken ct)
        {
            var routes = await _mediator.Send(new GetRoutesQuery(driverId, fromDate, toDate), ct);

            return Ok(routes);
        }

        [HttpPost("open")]
        public async Task<ActionResult<Guid>> CreateOpenRoute([FromBody] CreateRouteRequest request, CancellationToken ct)
        {
            var id = await _mediator.Send(
                new CreateRouteCommand(
                    request.DriverId,
                    request.VehicleId,
                    request.RouteTypeId,
                    request.StartDate,
                    request.StartOdometer),
                ct);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}/close")]
        public async Task<IActionResult> Close(Guid id, [FromBody] CloseRouteRequest request, CancellationToken ct)
        {
            await _mediator.Send(
                new CloseRouteCommand(
                    id,
                    request.EndOdometer,
                    request.EndDate),
                ct);

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> AddFullRoute([FromBody] AddFullRouteRequest request, CancellationToken ct)
        {
            var id = await _mediator.Send(
                new AddFullRouteCommand(
                    request.DriverId,
                    request.VehicleId,
                    request.RouteTypeId,
                    request.StartDate,
                    request.StartOdometer,
                    request.EndDate,
                    request.EndOdometer,
                    request.TotalDistance),
                ct);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRouteRequest request, CancellationToken ct)
        {
            await _mediator.Send(
                new UpdateRouteCommand(
                    id,
                    request.VehicleId,
                    request.RouteTypeId,
                    request.StartDate,
                    request.StartOdometer,
                    request.EndDate,
                    request.EndOdometer,
                    request.TotalDistance,
                    request.DriverPayment,
                    request.Revenue),
                ct);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _mediator.Send(new DeleteRouteCommand(id), ct);

            return NoContent();
        }
    }
}
