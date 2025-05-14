
export default function MeterEDTName(context) {
    let device = context.binding;
    if (context.binding.Device_Nav) {
        device = context.binding.Device_Nav;
    }
    return `${device.Device} - ${device.DeviceCategory_Nav.Description}`;
}
