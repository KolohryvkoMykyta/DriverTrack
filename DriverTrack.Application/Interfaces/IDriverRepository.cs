using DriverTrack.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Interfaces
{
    public interface IDriverRepository
    {
        Task<Driver?> GetByIdAsync(Guid id);
        Task<List<Driver>> GetAllAsync();
        Task AddAsync(Driver driver);
        Task UpdateAsync(Driver driver);
        Task DeleteAsync(Guid id);
    }
}
