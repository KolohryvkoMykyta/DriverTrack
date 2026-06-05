using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IUserAccountRepository
    {
        Task<UserAccount?> GetByEmailAsync(
            string email,
            CancellationToken cancellationToken = default);

        Task<bool> EmailExistsAsync(
            string email,
            CancellationToken cancellationToken = default);

        Task AddAsync(
            UserAccount userAccount,
            CancellationToken cancellationToken = default);

        Task<UserAccount?> GetByIdWithDriverAsync(
            Guid id, 
            CancellationToken cancellationToken);
    }
}