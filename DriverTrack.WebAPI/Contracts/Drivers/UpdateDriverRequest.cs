namespace DriverTrack.WebAPI.Contracts.Drivers
{
    public record UpdateDriverRequest(
        string Name, 
        string PhoneNumber, 
        bool IsActive);
}
