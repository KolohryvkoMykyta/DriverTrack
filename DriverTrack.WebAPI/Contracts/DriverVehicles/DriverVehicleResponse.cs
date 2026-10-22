namespace DriverTrack.WebAPI.Contracts.DriverVehicles;

public sealed record DriverVehicleResponse(
    Guid Id,
    string Brand,
    string Model,
    string LicensePlate,
    double? AverageFuelConsumption);