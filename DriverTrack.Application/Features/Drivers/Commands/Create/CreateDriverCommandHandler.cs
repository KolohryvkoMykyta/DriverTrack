using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Create
{
    public class CreateDriverCommandHandler : IRequestHandler<CreateDriverCommand, Guid>
    {
        private readonly IDriverRepository _driverRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhoneNumberNormalizer _phoneNumberNormalizer;

        public CreateDriverCommandHandler(IDriverRepository repository, IUnitOfWork unitOfWork, IPhoneNumberNormalizer phoneNumberNormalizer)
        {
            _driverRepository = repository;
            _unitOfWork = unitOfWork;
            _phoneNumberNormalizer = phoneNumberNormalizer;
        }

        public async Task<Guid> Handle(CreateDriverCommand request, CancellationToken cancellationToken)
        {
            var normalizedPhoneNumber = _phoneNumberNormalizer.NormalizeToE164(request.PhoneNumber);

            var driver = new Driver
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                PhoneNumber = normalizedPhoneNumber,
                IsActive = true
            };

            await _driverRepository.AddAsync(driver, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return driver.Id;
        }
    }
}
