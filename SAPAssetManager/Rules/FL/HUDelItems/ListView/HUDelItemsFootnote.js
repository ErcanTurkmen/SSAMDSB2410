export default function HUDelItemsFootnote(context) {
    return [context.binding.VoyageNumber,context.binding.ShippingPoint, context.binding.MaintenanceOrder].filter(val => !!val).join(',');
}
