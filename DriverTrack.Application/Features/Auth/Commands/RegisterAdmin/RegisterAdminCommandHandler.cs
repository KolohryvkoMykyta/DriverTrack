using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Entities;
using DriverTrack.Domain.Enums;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterAdmin
{
    public sealed class RegisterAdminCommandHandler : IRequestHandler<RegisterAdminCommand, AuthResponseDto>
    {
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterAdminCommandHandler(
            IUserAccountRepository userAccountRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator,
            IUnitOfWork unitOfWork)
        {
            _userAccountRepository = userAccountRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
            _unitOfWork = unitOfWork;
        }

        public async Task<AuthResponseDto> Handle(
            RegisterAdminCommand request,
            CancellationToken cancellationToken)
        {
            var emailExists = await _userAccountRepository.EmailExistsAsync(
                request.Email,
                cancellationToken);

            if (emailExists)
            {
                throw new ConflictException(ErrorMessages.Auth.EmailAlreadyRegistered);
            }

            var user = new UserAccount
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = _passwordHasher.Hash(request.Password),
                Role = UserRole.Admin,
                DriverId = null,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            };

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