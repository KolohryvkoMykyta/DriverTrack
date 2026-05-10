using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using PhoneNumbers;

namespace DriverTrack.Infrastructure.Services
{
    public sealed class LibPhoneNumberNormalizer : IPhoneNumberNormalizer
    {
        private const string DefaultRegion = "UA";
        private static readonly PhoneNumberUtil PhoneUtil = PhoneNumberUtil.GetInstance();

        public string NormalizeToE164(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw))
                throw new BusinessException(ErrorMessages.Drivers.InvalidPhoneNumber);

            raw = raw.Trim();

            try
            {
                var parsed = PhoneUtil.Parse(raw, DefaultRegion);

                if (!PhoneUtil.IsValidNumber(parsed))
                    throw new BusinessException(ErrorMessages.Drivers.InvalidPhoneNumber);

                return PhoneUtil.Format(parsed, PhoneNumberFormat.E164);
            }
            catch (NumberParseException)
            {
                throw new BusinessException(ErrorMessages.Drivers.InvalidPhoneNumber);
            }
        }
    }
}
