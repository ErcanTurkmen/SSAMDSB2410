
export default function MeterEDTStatus(context) {
    let device = context.binding;
    if (context.binding.Device_Nav) {
        device = context.binding.Device_Nav;
    }
    return `${device.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.StatusText}` + '\n' + `${device.DeviceBlocked ? context.localizeText('disconnect') : context.localizeText('connected')}`;
}
