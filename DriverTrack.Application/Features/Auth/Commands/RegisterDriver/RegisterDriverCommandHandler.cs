using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Entities;
using DriverTrack.Domain.Enums;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterDriver
{
    public sealed class RegisterDriverCommandHandler
        : IRequestHandler<RegisterDriverCommand, AuthResponseDto>
    {
        private readonly IDriverRepository _driverRepository;
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IPhoneNumberNormalizer _phoneNumberNormalizer;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterDriverCommandHandler(
            IDriverRepository driverRepository,
            IUserAccountRepository userAccountRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator,
            IPhoneNumberNormalizer phoneNumberNormalizer,
            IUnitOfWork unitOfWork)
        {
            _driverRepository = driverRepository;
            _userAccountRepository = userAccountRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
            _phoneNumberNormalizer = phoneNumberNormalizer;
            _unitOfWork = unitOfWork;
        }

        public async Task<AuthResponseDto> Handle(
            RegisterDriverCommand request,
            CancellationToken cancellationToken)
        {
            var emailExists = await _userAccountRepository.EmailExistsAsync(
                request.Email,
                cancellationToken);

            if (emailExists)
            {
                throw new ConflictException(
                    ErrorMessages.Auth.EmailAlreadyRegistered);
            }

            var normalizedPhoneNumber =
                _phoneNumberNormalizer.NormalizeToE164(request.PhoneNumber);

            var driver = new Driver
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                PhoneNumber = normalizedPhoneNumber,
                IsActive = true
            };

            var user = new UserAccount
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = _passwordHasher.Hash(request.Password),
                Role = UserRole.Driver,
                DriverId = driver.Id,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            };

            await _driverRepository.AddAsync(driver, cancellationToken);
            await _userAccountRepository.AddAsync(user, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var tokenResult = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = tokenResult.Token,
                ExpiresAtUtc = tokenResult.ExpiresAtUtc,
                Role = user.Role.ToString(),
                DriverId = user.DriverId
            };
        }
    }
}