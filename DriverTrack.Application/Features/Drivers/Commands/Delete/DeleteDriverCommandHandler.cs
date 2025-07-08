using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete;

public class DeleteDriverCommandHandler : IRequestHandler<DeleteDriverCommand, Unit>
{
    private readonly IDriverRepository _repository;

    public DeleteDriverCommandHandler(IDriverRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _repository.GetByIdAsync(request.Id);
        
        if (driver == null)
            throw new NotFoundException(nameof(Driver), request.Id);

        await _repository.DeleteAsync(request.Id);
        
        return Unit.Value;
    }
}