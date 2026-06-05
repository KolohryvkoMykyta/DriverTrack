using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery(Guid UserId) : IRequest<CurrentUserDto>;