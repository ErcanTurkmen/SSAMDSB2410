
export default function MeterEDTDeviceDisplayValue(context) {
    return context.binding?.Device_Nav?.Device || '$(L,select)';
}
