export default function MeterReadingLimitsIsVisible(context) {
    return !!context.binding.MeterReadingLimit_Nav.ErrorMinLimitChar || !!context.binding.MeterReadingLimit_Nav.ErrorMaxLimitChar;
}
