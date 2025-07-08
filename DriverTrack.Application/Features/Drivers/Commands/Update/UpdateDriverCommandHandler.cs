using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Update;

public class UpdateDriverCommandHandler : IRequestHandler<UpdateDriverCommand, Unit>
{
    private readonly IDriverRepository _repository;

    public UpdateDriverCommandHandler(IDriverRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(UpdateDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _repository.GetByIdAsync(request.Id);
        
        if (driver == null)
            throw new NotFoundException(nameof(Driver), request.Id);

        driver.Name = request.Name;
        driver.PhoneNumber = request.PhoneNumber;
        driver.IsActive = request.IsActive;

        await _repository.UpdateAsync(driver);

        return Unit.Value;
    }
}