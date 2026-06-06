namespace DriverTrack.WebAPI.Contracts.FuelPrices
{
    public sealed record UpdateFuelPriceRequest(
        decimal PricePerLiter,
        DateTime EffectiveFrom);
}