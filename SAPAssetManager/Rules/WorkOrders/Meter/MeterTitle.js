import { ValueIfExists } from '../../Meter/Format/Formatter';

export default function MeterTitle(context) {
    const binding = context.binding;
    let device = '';
    let deviceDescription = '';
    if (binding.Device_Nav) {
        device = binding.Device_Nav;
    }
    if (device.DeviceCategory_Nav) {
        deviceDescription = device.DeviceCategory_Nav.Description;
    }

    if (ValueIfExists(deviceDescription)) {
        return `${device.Device} - ${deviceDescription}`;
    }
    return device.Device;
}
