using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.Drivers.Commands.Create;
using DriverTrack.Application.Features.Drivers.Commands.Delete;
using DriverTrack.Application.Features.Drivers.Commands.Update;
using DriverTrack.Application.Features.Drivers.Queries;
using DriverTrack.WebAPI.Contracts.Drivers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DriversController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DriversController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<DriverListItemDto>>> Get()
        {
            var result = await _mediator.Send(new GetAllDriversQuery());

            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<DriverDto>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetDriverByIdQuery(id));

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateDriverRequest request, CancellationToken cancellationToken)
        {
            var command = new CreateDriverCommand(request.Name, request.PhoneNumber);
            
            var id = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateDriverRequest request, CancellationToken ct)
        {
            var command = new UpdateDriverCommand(
                id,
                request.Name,
                request.PhoneNumber,
                request.IsActive
            );

            await _mediator.Send(command, ct);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteDriverCommand(id));

            return NoContent();
        }
    }

}
