using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterDriver
{
    public sealed record RegisterDriverCommand(
        string Name,
        string PhoneNumber,
        string Email,
        string Password
    ) : IRequest<AuthResponseDto>;
}