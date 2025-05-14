
export default function MeasuringPointsEDTUpperRangeValue(context) {
    if (context.binding.IsCounter === 'X' && context.binding.IsCounterOverflow === 'X') {
        return context.binding.CounterOverflow ? String(context.binding.CounterOverflow) : '-';
    }
    return context.binding.UpperRange ? String(context.binding.UpperRange) : '-';
}
