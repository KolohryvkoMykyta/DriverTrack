using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Commands.UpdateVehicle
{
    public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, Unit>
    {
        private readonly IVehicleRepository _vehicleRepository;

        public UpdateVehicleCommandHandler(IVehicleRepository vehicleRepository)
        {
            _vehicleRepository = vehicleRepository;
        }

        public async Task<Unit> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(request.Id);

            if (vehicle is null)
                throw new NotFoundException(nameof(Vehicle), request.Id);

            vehicle.Brand = request.Brand;
            vehicle.Model = request.Model;
            vehicle.LicensePlate = request.LicensePlate;
            vehicle.IsActive = request.IsActive;

            await _vehicleRepository.UpdateAsync(vehicle);

            return Unit.Value;
        }
    }
}
