export default function SerialNumberOpenQuantity(context) {
    let quantityValue = context.binding.EntryQuantity || 0;
    return quantityValue;
}
