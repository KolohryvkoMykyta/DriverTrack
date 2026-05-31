using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.Login
{
    public sealed record LoginCommand(
        string Email,
        string Password
    ) : IRequest<AuthResponseDto>;
}