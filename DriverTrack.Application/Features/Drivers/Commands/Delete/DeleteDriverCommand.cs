using MediatR;
using System;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete;

public record DeleteDriverCommand(Guid Id) : IRequest<Unit>;