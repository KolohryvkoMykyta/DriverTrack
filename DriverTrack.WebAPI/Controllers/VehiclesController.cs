using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.Vehicles.Commands.CreateVehicle;
using DriverTrack.Application.Features.Vehicles.Commands.DeleteVehicle;
using DriverTrack.Application.Features.Vehicles.Commands.UpdateVehicle;
using DriverTrack.Application.Features.Vehicles.Queries.GetAllVehicles;
using DriverTrack.Application.Features.Vehicles.Queries.GetVehicleById;
using DriverTrack.Application.Features.Vehicles.Queries.GetVehiclesByDriver;
using DriverTrack.WebAPI.Contracts.Vehicles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class VehiclesController : ControllerBase
{
    private readonly IMediator _mediator;

    public VehiclesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VehicleDto>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetVehicleByIdQuery(id), ct);

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<VehicleDto>>> Get([FromQuery] Guid? driverId, CancellationToken ct)
    {
        if (driverId is null)
        {
            var result = await _mediator.Send(new GetAllVehiclesQuery(), ct);
            return Ok(result);
        }

        var resultByDriver = await _mediator.Send(new GetVehiclesByDriverQuery(driverId.Value), ct);

        return Ok(resultByDriver);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateVehicleRequest request, CancellationToken ct)
    {
        var command = new CreateVehicleCommand(request.DriverId, request.Brand, request.Model, request.LicensePlate);

        var id = await _mediator.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVehicleRequest request, CancellationToken ct)
    {
        var command = new UpdateVehicleCommand(id, request.Brand, request.Model, request.LicensePlate, request.IsActive, request.DriverId);

        await _mediator.Send(command, ct);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteVehicleCommand(id), ct);

        return NoContent();
    }
}

