using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.Drivers.Commands.Create
{
    public class CreateDriverCommandHandler : IRequestHandler<CreateDriverCommand, Guid>
    {
        private readonly IDriverRepository _repository;

        public CreateDriverCommandHandler(IDriverRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateDriverCommand request, CancellationToken cancellationToken)
        {
            var driver = new Driver
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                IsActive = true
            };

            await _repository.AddAsync(driver);
            
            return driver.Id;
        }
    }
}
