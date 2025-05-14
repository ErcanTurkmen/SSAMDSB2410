export default function PackageItemsSubstatus(context) {
    const RetblQtyInOrderUnit = context.binding.RetblQtyInOrderUnit? Math.trunc(context.binding.RetblQtyInOrderUnit): '';
    return [RetblQtyInOrderUnit, context.binding.RetblQtyBaseUnit].filter(val => !!val).join(' ');
}

