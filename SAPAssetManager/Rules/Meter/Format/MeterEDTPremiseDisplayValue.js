
export default function MeterEDTPremiseDisplayValue(context) {
    return context.binding.Premise ? context.binding.Premise : '$(L,select)';
}
