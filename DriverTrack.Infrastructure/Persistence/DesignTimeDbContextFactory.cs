using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DriverTrack.Infrastructure.Persistence
{
    public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DriverTrackDbContext>
    {
        public DriverTrackDbContext CreateDbContext(string[] args)
        {
            var options = new DbContextOptionsBuilder<DriverTrackDbContext>()
                .UseSqlite("Data Source=drivertrack.db")
                .Options;

            return new DriverTrackDbContext(options);
        }
    }
}
