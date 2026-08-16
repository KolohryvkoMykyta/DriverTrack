using DriverTrack.Application.DTOs;
using DriverTrack.Application.Features.Auth.Commands.Login;
using DriverTrack.Application.Features.Auth.Commands.RegisterAdmin;
using DriverTrack.Application.Features.Auth.Commands.RegisterDriver;
using DriverTrack.Application.Features.Auth.Queries.GetCurrentUser;
using DriverTrack.WebAPI.Contracts.Auth;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DriverTrack.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            var command = new LoginCommand(
                request.Email,
                request.Password);

            var response = await _mediator.Send(command, cancellationToken);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register-admin")]
        public async Task<ActionResult<AuthResponseDto>> RegisterAdmin(
            RegisterAdminRequest request,
            CancellationToken cancellationToken)
        {
            var command = new RegisterAdminCommand(
                request.Name,
                request.Email,
                request.Password);

            var response = await _mediator.Send(command, cancellationToken);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register-driver")]
        public async Task<ActionResult<AuthResponseDto>> RegisterDriver(
            RegisterDriverRequest request,
            CancellationToken cancellationToken)
        {
            var command = new RegisterDriverCommand(
                request.Name,
                request.PhoneNumber,
                request.Email,
                request.Password);

            var response = await _mediator.Send(command, cancellationToken);

            return Ok(response);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<CurrentUserDto>> Me(CancellationToken cancellationToken)
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdValue, out var userId))
            {
                return Unauthorized();
            }

            var currentUser = await _mediator.Send(
                new GetCurrentUserQuery(userId),
                cancellationToken);

            return Ok(currentUser);
        }
    }
}