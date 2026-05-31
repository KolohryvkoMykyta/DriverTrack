using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Persistence.Repositories
{
    public sealed class UserAccountRepository : IUserAccountRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public UserAccountRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserAccount?> GetByEmailAsync(
            string email,
            CancellationToken cancellationToken = default)
        {
            return await _dbContext.UserAccounts
                .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
        }

        public async Task<bool> EmailExistsAsync(
            string email,
            CancellationToken cancellationToken = default)
        {
            return await _dbContext.UserAccounts
                .AnyAsync(x => x.Email == email, cancellationToken);
        }

        public async Task AddAsync(
            UserAccount userAccount,
            CancellationToken cancellationToken = default)
        {
            await _dbContext.UserAccounts.AddAsync(userAccount, cancellationToken);
        }
    }
}