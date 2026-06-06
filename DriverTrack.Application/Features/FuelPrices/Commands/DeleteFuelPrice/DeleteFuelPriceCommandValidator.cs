using FluentValidation;

namespace DriverTrack.Application.Features.FuelPrices.Commands.DeleteFuelPrice
{
    public sealed class DeleteFuelPriceCommandValidator
        : AbstractValidator<DeleteFuelPriceCommand>
    {
        public DeleteFuelPriceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор ціни пального є обов'язковим.");
        }
    }
}