using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType;
using DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType;
using DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType;
using DriverTrack.Application.Features.RouteTypes.Queries.GetAllRouteTypes;
using DriverTrack.Application.Features.RouteTypes.Queries.GetRouteTypeById;
using DriverTrack.WebAPI.Contracts.RouteTypes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteTypesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RouteTypesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<RouteTypeDto>>> GetAll(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetAllRouteTypesQuery(), cancellationToken);

            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RouteTypeDto>> GetById(Guid id, CancellationToken cancellationToken)
        {
            var routeType = await _mediator.Send(new GetRouteTypeByIdQuery(id), cancellationToken);

            return Ok(routeType);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateRouteTypeRequest request, CancellationToken cancellationToken)
        {
            var id = await _mediator.Send(new CreateRouteTypeCommand(request.Name, request.Earnings), cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRouteTypeRequest request, CancellationToken cancellationToken)
        {
            await _mediator.Send(new UpdateRouteTypeCommand(id, request.Name, request.Earnings), cancellationToken);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            await _mediator.Send(new DeleteRouteTypeCommand(id), cancellationToken);

            return NoContent();
        }
    }
}
