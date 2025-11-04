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
        private readonly IDriverRepository _driverRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateDriverCommandHandler(IDriverRepository repository, IUnitOfWork unitOfWork)
        {
            _driverRepository = repository;
            _unitOfWork = unitOfWork;
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

            await _driverRepository.AddAsync(driver, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return driver.Id;
        }
    }
}
