using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterAdmin
{
    public sealed record RegisterAdminCommand(
        string Name,
        string Email,
        string Password
    ) : IRequest<AuthResponseDto>;
}