using FluentValidation;

namespace DriverTrack.Application.Features.Vehicles.Commands.DeleteVehicle
{
    public sealed class DeleteVehicleCommandValidator : AbstractValidator<DeleteVehicleCommand>
    {
        public DeleteVehicleCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор автомобіля є обов'язковим.");
        }
    }
}
