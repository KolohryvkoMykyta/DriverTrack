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
            int minLength,
            int maxLength)
        {
            return ruleBuilder
                .NotEmpty().WithMessage("Ім'я є обов'язковим.")
                .MinimumLength(minLength).WithMessage($"Ім'я має містити щонайменше {minLength} символи.")
                .MaximumLength(maxLength).WithMessage($"Ім'я має містити не більше {maxLength} символів.")
                .ValidPersonName().WithMessage("Ім'я може містити лише літери, пробіли, дефіси та апострофи.");
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
