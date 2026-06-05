using FluentValidation;
using PhoneNumbers;

namespace DriverTrack.Application.Common.Validation
{
    public static class PhoneNumberValidationExtensions
    {
        private static readonly PhoneNumberUtil PhoneUtil = PhoneNumberUtil.GetInstance();

        public static IRuleBuilderOptions<T, string> ValidPhoneNumber<T>(
            this IRuleBuilder<T, string> ruleBuilder, 
            string defaultRegion)
        {
            return ruleBuilder.Must(phone => IsValidPhoneNumber(phone, defaultRegion));
        }

        public static IRuleBuilderOptions<T, string> RequiredPhoneNumber<T>(
            this IRuleBuilder<T, string> ruleBuilder,
            int maxLength,
            string defaultRegion)
        {
            return ruleBuilder
                    .NotEmpty().WithMessage("Phone number is required.")
                    .MaximumLength(maxLength).WithMessage($"Phone number must be at most {maxLength} characters.")
                    .ValidPhoneNumber(defaultRegion).WithMessage("Invalid phone number format. Please provide a valid international phone number.");
        }

        private static bool IsValidPhoneNumber(string? phone, string defaultRegion)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return false;

            phone = phone.Trim();

            try
            {
                var parsed = PhoneUtil.Parse(phone, defaultRegion);
                return PhoneUtil.IsValidNumber(parsed);
            }
            catch
            {
                return false;
            }
        }
    }
}
