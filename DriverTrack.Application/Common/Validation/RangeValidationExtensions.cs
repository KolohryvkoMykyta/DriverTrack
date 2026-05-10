using FluentValidation;

namespace DriverTrack.Application.Common.Validation
{
    public static class RangeValidationExtensions
    {
        public static IRuleBuilderOptions<T, T> HasValidInterval<T, TValue>(
            this IRuleBuilder<T, T> ruleBuilder,
            Func<T, TValue?> startSelector,
            Func<T, TValue?> endSelector)
            where TValue : struct, IComparable<TValue>
        {
            return ruleBuilder.Must(x =>
            {
                var start = startSelector(x);
                var end = endSelector(x);

                if (!start.HasValue || !end.HasValue)
                    return true;

                return start.Value.CompareTo(end.Value) <= 0;
            });
        }

        public static IRuleBuilderOptions<T, T> HasValidInterval<T, TValue>(
            this IRuleBuilder<T, T> ruleBuilder,
            Func<T, TValue> startSelector,
            Func<T, TValue> endSelector)
            where TValue : struct, IComparable<TValue>
        {
            return ruleBuilder.Must(x =>
                startSelector(x).CompareTo(endSelector(x)) <= 0
            );
        }
    }
}
