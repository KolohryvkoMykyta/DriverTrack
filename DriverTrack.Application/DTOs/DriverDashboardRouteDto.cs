public sealed class DriverDashboardRouteDto
{
    public Guid Id { get; init; }

    public string RouteTypeName { get; init; } = string.Empty;

    public string VehicleName { get; init; } = string.Empty;

    public string LicensePlate { get; init; } = string.Empty;

    public DateTime StartDate { get; init; }

    public DateTime EndDate { get; init; }

    public double TotalDistance { get; init; }

    public decimal DriverPayment { get; init; }
}