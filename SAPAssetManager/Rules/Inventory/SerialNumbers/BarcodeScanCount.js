export default function BarcodeScanCount(context) {
    return context.localizeText('scan_msg', [context.binding.Temp_Serial_ScannedNum, context.binding.Temp_Serial_EntryQuantity]);
}
