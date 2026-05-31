using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete;

public class DeleteDriverCommandHandler : IRequestHandler<DeleteDriverCommand, Unit>
{
    private readonly IDriverRepository _driverRepository;
    private readonly IUnitOfWork _unitOfWork;  

    public DeleteDriverCommandHandler(IDriverRepository repository, IUnitOfWork unitOfWork)
    {
        _driverRepository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeleteDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _driverRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (driver == null)
            throw new NotFoundException(nameof(Driver), request.Id);

        await _driverRepository.DeleteAsync(request.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}