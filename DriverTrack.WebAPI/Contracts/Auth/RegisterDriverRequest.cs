namespace DriverTrack.WebAPI.Contracts.Auth
{
    public sealed record RegisterDriverRequest(
        string Name,
        string PhoneNumber,
        string Email,
        string Password);
}
