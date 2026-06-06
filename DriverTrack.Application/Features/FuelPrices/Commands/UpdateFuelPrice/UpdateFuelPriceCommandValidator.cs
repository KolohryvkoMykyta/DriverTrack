using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.FuelPrices.Commands.UpdateFuelPrice
{
    public sealed class UpdateFuelPriceCommandValidator
        : AbstractValidator<UpdateFuelPriceCommand>
    {
        public UpdateFuelPriceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор ціни пального є обов'язковим.");

            RuleFor(x => x.PricePerLiter)
                .GreaterThan(0)
                .WithMessage("Ціна за літр має бути більшою за 0.")
                .LessThanOrEqualTo(FuelPriceValidationConstants.MaxPricePerLiter)
                .WithMessage($"Ціна за літр має бути не більшою за {FuelPriceValidationConstants.MaxPricePerLiter}.");

            RuleFor(x => x.EffectiveFrom)
                .NotEmpty()
                .WithMessage("Дата початку дії ціни є обов'язковою.");
        }
    }
}