
export default function MeterEDTReasonOnValueChange(context) {
    context.binding.Device_Nav.ActivityReason = context.getValue();
}
