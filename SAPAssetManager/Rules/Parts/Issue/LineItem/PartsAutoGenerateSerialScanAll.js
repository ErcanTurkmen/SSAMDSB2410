export default function PartsAutoGenerateSerialScanAll(context) {
    let binding = context.binding;
    return binding.SerialNoProfile ? 'X' : '';
}
