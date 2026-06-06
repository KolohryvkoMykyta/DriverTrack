using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class RouteEntryConfiguration : IEntityTypeConfiguration<RouteEntry>
    {
        public void Configure(EntityTypeBuilder<RouteEntry> builder)
        {
            builder.HasKey(routeEntry => routeEntry.Id);

            builder.Property(routeEntry => routeEntry.StartDate)
                .IsRequired();

            builder.Property(routeEntry => routeEntry.DriverPayment)
                .HasPrecision(18, 2);

            builder.Property(routeEntry => routeEntry.Revenue)
                .HasPrecision(18, 2);

            builder.HasOne(routeEntry => routeEntry.Driver)
                .WithMany(driver => driver.RouteEntries)
                .HasForeignKey(routeEntry => routeEntry.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(routeEntry => routeEntry.Vehicle)
                .WithMany(vehicle => vehicle.RouteEntries)
                .HasForeignKey(routeEntry => routeEntry.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(routeEntry => routeEntry.RouteType)
                .WithMany(routeType => routeType.RouteEntries)
                .HasForeignKey(routeEntry => routeEntry.RouteTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(routeEntry => new { routeEntry.VehicleId, routeEntry.StartDate });
            builder.HasIndex(routeEntry => new { routeEntry.DriverId, routeEntry.StartDate });
            builder.HasIndex(routeEntry => routeEntry.RouteTypeId);
        }
    }
}
