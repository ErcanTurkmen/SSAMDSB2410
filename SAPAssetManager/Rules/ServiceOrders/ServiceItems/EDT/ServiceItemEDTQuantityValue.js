
export default function ServiceItemEDTQuantityValue(context) {
    let binding = context.getBindingObject();
    return Number(binding.Quantity);
}
