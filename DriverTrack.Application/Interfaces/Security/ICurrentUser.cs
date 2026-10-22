namespace DriverTrack.Application.Interfaces.Security;

public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    Guid? UserId { get; }

    Guid? DriverId { get; }

    bool IsAdmin { get; }

    bool IsDriver { get; }
}