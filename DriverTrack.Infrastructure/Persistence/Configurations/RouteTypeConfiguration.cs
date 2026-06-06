using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class RouteTypeConfiguration : IEntityTypeConfiguration<RouteType>
    {
        public void Configure(EntityTypeBuilder<RouteType> builder)
        {
            builder.HasKey(routeType => routeType.Id);

            builder.Property(routeType => routeType.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(routeType => routeType.DriverPayment)
                .HasPrecision(18, 2);

            builder.Property(routeType => routeType.Revenue)
                .HasPrecision(18, 2);

            builder.HasIndex(routeType => routeType.Name)
                .IsUnique();
        }
    }
}
