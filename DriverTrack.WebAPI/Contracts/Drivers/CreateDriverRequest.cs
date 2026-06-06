namespace DriverTrack.WebAPI.Contracts.Drivers
{
    public sealed record CreateDriverRequest
    {
        public string Name { get; init; } = string.Empty;

        public string PhoneNumber { get; init; } = string.Empty;
    }
}