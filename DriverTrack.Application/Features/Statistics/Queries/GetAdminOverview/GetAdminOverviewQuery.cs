using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Statistics.Queries.GetAdminOverview
{
    public sealed record GetAdminOverviewQuery(
        DateTime? From,
        DateTime? To,
        Guid? DriverId,
        Guid? VehicleId)
        : IRequest<AdminOverviewDto>;
}