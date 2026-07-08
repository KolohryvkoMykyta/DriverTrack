using FluentValidation;

namespace DriverTrack.Application.Features.FuelEntries.Commands.DeleteFuelEntry
{
    public sealed class DeleteFuelEntryValidator : AbstractValidator<DeleteFuelEntryCommand>
    {
        public DeleteFuelEntryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор запису пального є обов'язковим.");
        }
    }
}
