export default function HUDelItemsSubhead(context) {
    return context.binding.HandlingUnitID ? context.binding.HandlingUnitID : context.binding.ReferenceDocNumber;
}
