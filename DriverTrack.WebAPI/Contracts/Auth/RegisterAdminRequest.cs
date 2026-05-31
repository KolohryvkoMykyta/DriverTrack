namespace DriverTrack.WebAPI.Contracts.Auth
{
    public sealed record RegisterAdminRequest(
        string Email,
        string Password);
}