
export default function MeasuringPointsEDTLowerRangeValue(context) {
    return context.binding.LowerRange ? String(context.binding.LowerRange) : '-';
}
