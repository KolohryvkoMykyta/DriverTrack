using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete;

public record DeleteDriverCommand(Guid Id) : IRequest<Unit>;