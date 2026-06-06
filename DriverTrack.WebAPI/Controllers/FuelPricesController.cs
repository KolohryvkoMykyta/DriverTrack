using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.FuelPrices.Commands.CreateFuelPrice;
using DriverTrack.Application.Features.FuelPrices.Commands.DeleteFuelPrice;
using DriverTrack.Application.Features.FuelPrices.Commands.UpdateFuelPrice;
using DriverTrack.Application.Features.FuelPrices.Queries.GetAllFuelPrices;
using DriverTrack.Application.Features.FuelPrices.Queries.GetCurrentFuelPrice;
using DriverTrack.WebAPI.Contracts.FuelPrices;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class FuelPricesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FuelPricesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<FuelPriceDto>>> GetAll(CancellationToken ct)
        {
            var result = await _mediator.Send(new GetAllFuelPricesQuery(), ct);

            return Ok(result);
        }

        [HttpGet("current")]
        public async Task<ActionResult<FuelPriceDto?>> GetCurrent(
            [FromQuery] DateTime? date,
            CancellationToken ct)
        {
            var targetDate = date ?? DateTime.UtcNow;

            var result = await _mediator.Send(
                new GetCurrentFuelPriceQuery(targetDate),
                ct);

            if (result is null)
                return NoContent();

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<FuelPriceDto>> Create(
            [FromBody] CreateFuelPriceRequest request,
            CancellationToken ct)
        {
            var result = await _mediator.Send(
                new CreateFuelPriceCommand(
                    request.PricePerLiter,
                    request.EffectiveFrom),
                ct);

            return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<FuelPriceDto>> Update(
            Guid id,
            [FromBody] UpdateFuelPriceRequest request,
            CancellationToken ct)
        {
            var result = await _mediator.Send(
                new UpdateFuelPriceCommand(
                    id,
                    request.PricePerLiter,
                    request.EffectiveFrom),
                ct);

            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await _mediator.Send(new DeleteFuelPriceCommand(id), ct);

            return NoContent();
        }
    }
}