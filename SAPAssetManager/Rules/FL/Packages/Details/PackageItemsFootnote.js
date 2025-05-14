export default function PackageItemsFootnote(context) {
    return [context.binding.HandlingUnitID, context.binding.PackagingMaterial].filter(val => !!val).join(',');
}
