namespace DriverTrack.WebAPI.Contracts.FuelPrices
{
    public sealed record CreateFuelPriceRequest(
        decimal PricePerLiter,
        DateTime EffectiveFrom);
}