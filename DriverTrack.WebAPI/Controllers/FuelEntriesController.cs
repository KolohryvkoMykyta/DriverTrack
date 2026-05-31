using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry;
using DriverTrack.Application.Features.FuelEntries.Commands.DeleteFuelEntry;
using DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry;
using DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByDriverId;
using DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByVehicleId;
using DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntryById;
using DriverTrack.WebAPI.Contracts.FuelEntries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class FuelEntriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FuelEntriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FuelEntryDto>> GetById(Guid id, CancellationToken ct)
        {
            var entry = await _mediator.Send(new GetFuelEntryByIdQuery(id), ct);

            return Ok(entry);
        }

        [HttpGet]
        public async Task<ActionResult<List<FuelEntryDto>>> Get(
            [FromQuery] Guid? driverId,
            [FromQuery] Guid? vehicleId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            CancellationToken ct)
        {
            if (driverId.HasValue && vehicleId.HasValue)
            {
                throw new BusinessException(ErrorMessages.Filters.OnlyOneFilterAllowed);
            }

            if (driverId.HasValue)
            {
                var result = await _mediator.Send(new GetFuelByDriverIdQuery(driverId.Value, from, to), ct);

                return Ok(result);
            }

            if (vehicleId.HasValue)
            {
                var result = await _mediator.Send(new GetFuelByVehicleIdQuery(vehicleId.Value, from, to), ct);

                return Ok(result);
            }

            throw new BusinessException(ErrorMessages.Filters.DriverOrVehicleRequired);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFuelEntryRequest request, CancellationToken ct)
        {
            var id = await _mediator.Send(new CreateFuelEntryCommand(
                request.DriverId,
                request.VehicleId,
                request.Date,
                request.OdometerReading,
                request.Liters,
                request.IsFullTank), 
                ct);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id,[FromBody] UpdateFuelEntryRequest request, CancellationToken ct)
        {
            await _mediator.Send(new UpdateFuelEntryCommand(
                id,
                request.Date,
                request.OdometerReading,
                request.Liters,
                request.IsFullTank), 
                ct);
            
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _mediator.Send(new DeleteFuelEntryCommand(id), ct);
            
            return NoContent();
        }
    }
}
