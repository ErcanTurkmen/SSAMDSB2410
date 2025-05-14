export default function HUDelItemsDescription(context) {
    return context.binding.HandlingUnitID ? [context.binding.KitIdentifier, context.binding.PackagingMaterial].filter(val => !!val).join(','): context.binding.KitIdentifier;
}

