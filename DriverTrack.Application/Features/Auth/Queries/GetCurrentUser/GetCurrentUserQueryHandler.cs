using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.Auth.Queries.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler
    : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    private readonly IUserAccountRepository _userAccountRepository;

    public GetCurrentUserQueryHandler(IUserAccountRepository userAccountRepository)
    {
        _userAccountRepository = userAccountRepository;
    }

    public async Task<CurrentUserDto> Handle(
        GetCurrentUserQuery request,
        CancellationToken cancellationToken)
    {

        var user = await _userAccountRepository.GetByIdWithDriverAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedException(ErrorMessages.Auth.UserNotAuthorized);
        }

        return new CurrentUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role.ToString(),
            DriverId = user.DriverId,
            DisplayName = user.Name
        };
    }
}