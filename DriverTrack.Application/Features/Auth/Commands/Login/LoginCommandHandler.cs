using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Commands.Login
{
    public sealed class LoginCommandHandler
        : IRequestHandler<LoginCommand, AuthResponseDto>
    {
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public LoginCommandHandler(
            IUserAccountRepository userAccountRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userAccountRepository = userAccountRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponseDto> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            var user = await _userAccountRepository.GetByEmailAsync(
                request.Email,
                cancellationToken);

            if (user is null)
            {
                throw new UnauthorizedException(
                    ErrorMessages.Auth.InvalidEmailOrPassword);
            }

            var passwordValid = _passwordHasher.Verify(
                request.Password,
                user.PasswordHash);

            if (!passwordValid)
            {
                throw new UnauthorizedException(
                    ErrorMessages.Auth.InvalidEmailOrPassword);
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedException(
                    ErrorMessages.Auth.UserIsInactive);
            }

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