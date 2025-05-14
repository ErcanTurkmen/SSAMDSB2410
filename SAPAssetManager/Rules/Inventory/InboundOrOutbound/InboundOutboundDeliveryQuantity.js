export default function InboundOutboundDeliveryQuantity(context, item) {
    const binding = item || context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    let pickedText = context.formatNumber(binding.PickedQuantity, '', {maximumFractionDigits: decimals, minimumFractionDigits : 0});
    let quantityText = context.formatNumber(binding.Quantity, '', {maximumFractionDigits: decimals, minimumFractionDigits : 0});

    return context.localizeText('item_open_quantities',[pickedText,quantityText,binding.UOM]);
}
