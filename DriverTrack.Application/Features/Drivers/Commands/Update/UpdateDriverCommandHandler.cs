using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Update;

public class UpdateDriverCommandHandler : IRequestHandler<UpdateDriverCommand, Unit>
{
    private readonly IDriverRepository _driverRepository;

    public UpdateDriverCommandHandler(IDriverRepository repository)
    {
        _driverRepository = repository;
    }

    public async Task<Unit> Handle(UpdateDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _driverRepository.GetByIdAsync(request.Id);
        
        if (driver == null)
            throw new NotFoundException(nameof(Driver), request.Id);

        driver.Name = request.Name;
        driver.PhoneNumber = request.PhoneNumber;
        driver.IsActive = request.IsActive;

        await _driverRepository.UpdateAsync(driver);

        return Unit.Value;
    }
}