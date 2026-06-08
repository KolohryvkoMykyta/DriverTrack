using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.Statistics.Queries.GetAdminOverview;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StatisticsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("admin-overview")]
        public async Task<ActionResult<AdminOverviewDto>> GetAdminOverview(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] Guid? driverId,
            [FromQuery] Guid? vehicleId,
            CancellationToken ct)
        {
            var result = await _mediator.Send(
                new GetAdminOverviewQuery(
                    from,
                    to,
                    driverId,
                    vehicleId),
                ct);

            return Ok(result);
        }
    }
}