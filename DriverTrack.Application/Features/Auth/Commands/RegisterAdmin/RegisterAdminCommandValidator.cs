using FluentValidation;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterAdmin
{
    public sealed class RegisterAdminCommandValidator : AbstractValidator<RegisterAdminCommand>
    {
        public RegisterAdminCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(4);
        }
    }
}