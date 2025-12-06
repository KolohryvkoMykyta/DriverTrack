namespace DriverTrack.WebAPI.Contracts.FuelEntries
{
    public record CreateFuelEntryRequest(
            Guid DriverId,
            Guid VehicleId,
            DateTime Date,
            double OdometerReading,
            double Liters,
            bool IsFullTank);
}
