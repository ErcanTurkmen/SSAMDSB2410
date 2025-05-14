export default function MeterReadingLimitsIsVisible(context) {
    return !!context.binding.MeterReadingLimit_Nav.WarningMinLimitChar || !!context.binding.MeterReadingLimit_Nav.WarningMaxLimitChar;
}
