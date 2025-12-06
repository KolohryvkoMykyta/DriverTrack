namespace DriverTrack.WebAPI.Contracts.FuelEntries
{
    public record UpdateFuelEntryRequest(
            DateTime Date,
            double OdometerReading,
            double Liters,
            bool IsFullTank);
}
