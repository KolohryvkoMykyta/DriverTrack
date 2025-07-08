using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Update;

public record UpdateDriverCommand(
    Guid Id,
    string Name,
    string PhoneNumber,
    bool IsActive
) : IRequest<Unit>;
