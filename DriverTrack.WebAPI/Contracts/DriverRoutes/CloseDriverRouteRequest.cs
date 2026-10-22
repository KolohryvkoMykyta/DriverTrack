namespace DriverTrack.WebAPI.Contracts.DriverRoutes;

public sealed record CloseDriverRouteRequest(
    double EndOdometer,
    DateTime? EndDate);