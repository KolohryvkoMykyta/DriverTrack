using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Update;

public class UpdateDriverCommandHandler
    : IRequestHandler<UpdateDriverCommand, Unit>
{
    private readonly IDriverRepository _driverRepository;
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhoneNumberNormalizer _phoneNumberNormalizer;

    public UpdateDriverCommandHandler(
        IDriverRepository driverRepository,
        IUserAccountRepository userAccountRepository,
        IUnitOfWork unitOfWork,
        IPhoneNumberNormalizer phoneNumberNormalizer)
    {
        _driverRepository = driverRepository;
        _userAccountRepository = userAccountRepository;
        _unitOfWork = unitOfWork;
        _phoneNumberNormalizer = phoneNumberNormalizer;
    }

    public async Task<Unit> Handle(
        UpdateDriverCommand request,
        CancellationToken cancellationToken)
    {
        var driver = await _driverRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (driver is null)
        {
            throw new NotFoundException(
                nameof(Driver),
                request.Id);
        }

        driver.Name = request.Name;
        driver.PhoneNumber =
            _phoneNumberNormalizer.NormalizeToE164(
                request.PhoneNumber);
        driver.IsActive = request.IsActive;

        var userAccount =
            await _userAccountRepository.GetByDriverIdAsync(
                driver.Id,
                cancellationToken);

        if (userAccount is not null)
        {
            userAccount.Name = request.Name;
        }

        _driverRepository.Update(driver);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}