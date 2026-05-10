using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Queries.GetVehicleById
{
    public record GetVehicleByIdQuery(Guid Id) : IRequest<VehicleDto>;
}
