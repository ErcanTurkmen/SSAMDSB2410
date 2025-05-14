
export default function MeterEDTDeviceQuery(context) {
    return `$filter=EquipmentNum eq '${context.binding.Device_Nav?.EquipmentNum}'`;
}
