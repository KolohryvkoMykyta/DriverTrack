using MediatR;

namespace DriverTrack.Application.Features.Statistics.Queries.GetDriverDashboard;

public sealed record GetDriverDashboardQuery(
    DateTime From,
    DateTime To) : IRequest<DriverDashboardDto>;