using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class FuelEntryConfiguration : IEntityTypeConfiguration<FuelEntry>
    {
        public void Configure(EntityTypeBuilder<FuelEntry> builder)
        {
            builder.HasKey(fuelEntry => fuelEntry.Id);

            builder.Property(fuelEntry => fuelEntry.Date)
                .IsRequired();

            builder.Property(fuelEntry => fuelEntry.IsFullTank)
                .HasDefaultValue(false);

            builder.HasOne(fuelEntry => fuelEntry.Driver)
                .WithMany(driver => driver.FuelEntries)
                .HasForeignKey(fuelEntry => fuelEntry.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(fuelEntry => fuelEntry.Vehicle)
                .WithMany(vehicle => vehicle.FuelEntries)
                .HasForeignKey(fuelEntry => fuelEntry.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(fuelEntry => new { fuelEntry.VehicleId, fuelEntry.Date });
            builder.HasIndex(fuelEntry => new { fuelEntry.DriverId, fuelEntry.Date });
        }
    }
}
