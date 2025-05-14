
export default function MeterEDTReasonDisplayValue(context) {
    return context.binding.ActivityReason ? context.binding.ActivityReason + ' - ' + context.binding.Description : '$(L,select)';
}
