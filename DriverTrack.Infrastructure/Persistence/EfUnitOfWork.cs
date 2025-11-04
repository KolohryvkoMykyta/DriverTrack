using DriverTrack.Application.Interfaces;

namespace DriverTrack.Infrastructure.Persistence
{
    public sealed class EfUnitOfWork : IUnitOfWork
    {
        private readonly DriverTrackDbContext _db;
        public EfUnitOfWork(DriverTrackDbContext db) => _db = db;
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
            => _db.SaveChangesAsync(cancellationToken);
    }
}
