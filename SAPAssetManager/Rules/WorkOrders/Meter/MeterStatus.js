export default function MeterStatus(context) {
    let device = context.binding;
    let connection;
    if (device.Device_Nav) {
        device = context.binding.Device_Nav;
    }
    if (!context.binding.Device_Nav.DeviceBlocked) {
        connection = context.localizeText('connected');
    } else {
        connection = context.localizeText('disconnected');
    }
    const status = device.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.StatusText;

    return `${status}\n${connection}`;
}
