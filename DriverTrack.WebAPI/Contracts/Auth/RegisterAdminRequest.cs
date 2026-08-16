namespace DriverTrack.WebAPI.Contracts.Auth
{
    public sealed record RegisterAdminRequest(
        string Name,
        string Email,
        string Password);
}