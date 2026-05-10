using FluentValidation;

namespace DriverTrack.Application.Common.Validation
{
    public static class NameValidationExtensions
    {
        public static IRuleBuilderOptions<T, string> ValidPersonName<T>(
            this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Must(IsValidPersonName);
        }

        public static IRuleBuilderOptions<T, string> RequiredPersonName<T>(
            this IRuleBuilder<T, string> ruleBuilder,
            int minLenght,
            int maxLenght)
        {
            return ruleBuilder
                .NotEmpty().WithMessage("Name is required.")
                .MinimumLength(minLenght).WithMessage($"Name must be at least {minLenght} characters.")
                .MaximumLength(maxLenght).WithMessage($"Name must be at most {maxLenght} characters.")
                .ValidPersonName().WithMessage("Name must contain letters and may include spaces, hyphens and apostrophes.");
        }

        private static bool IsValidPersonName(string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            name = name.Trim();

            if (!name.Any(char.IsLetter))
                return false;

            foreach (var c in name)
            {
                if (char.IsLetter(c) 
                    || c == ' '
                    || c == '-'
                    || c == '\''
                    || c == '`'
                    || c == '’')
                {
                    continue;
                }

                return false;
            }

            return true;
        }
    }
}
