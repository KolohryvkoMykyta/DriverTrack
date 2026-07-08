using FluentValidation;

namespace DriverTrack.Application.Features.Drivers.Commands.Delete
{
    public sealed class DeleteDriverCommandValidator : AbstractValidator<DeleteDriverCommand>
    {
        public DeleteDriverCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор водія є обов'язковим.");
        }
    }
}
