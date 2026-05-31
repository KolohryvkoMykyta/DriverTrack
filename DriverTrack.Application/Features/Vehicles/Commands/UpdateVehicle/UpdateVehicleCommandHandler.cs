using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Commands.UpdateVehicle
{
    public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, Unit>
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateVehicleCommandHandler(IVehicleRepository vehicleRepository, IUnitOfWork unitOfWork)
        {
            _vehicleRepository = vehicleRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(request.Id, cancellationToken);

            if (vehicle is null)
                throw new NotFoundException(nameof(Vehicle), request.Id);

            vehicle.Brand = request.Brand;
            vehicle.Model = request.Model;
            vehicle.LicensePlate = request.LicensePlate;
            vehicle.IsActive = request.IsActive;

            _vehicleRepository.Update(vehicle);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
