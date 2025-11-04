using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete;

public class DeleteDriverCommandHandler : IRequestHandler<DeleteDriverCommand, Unit>
{
    private readonly IDriverRepository _driverRepository;

    public DeleteDriverCommandHandler(IDriverRepository repository)
    {
        _driverRepository = repository;
    }

    public async Task<Unit> Handle(DeleteDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _driverRepository.GetByIdAsync(request.Id);
        
        if (driver == null)
            throw new NotFoundException(nameof(Driver), request.Id);

        await _driverRepository.DeleteAsync(request.Id);
        
        return Unit.Value;
    }
}