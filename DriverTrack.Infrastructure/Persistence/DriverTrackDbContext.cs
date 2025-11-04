using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Persistence
{
    public sealed class DriverTrackDbContext : DbContext
    {
        public DriverTrackDbContext(DbContextOptions<DriverTrackDbContext> options)
            : base(options) { }

        public DbSet<Driver> Drivers => Set<Driver>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<FuelEntry> FuelEntries => Set<FuelEntry>();
        public DbSet<RouteEntry> RouteEntries => Set<RouteEntry>();
        public DbSet<RouteType> RouteTypes => Set<RouteType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DriverTrackDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
