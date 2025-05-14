
export default function PackageFootnote(context) {
    return [context.binding.SupplierNo, context.binding.ShippingPoint].filter(val => !!val).join(',');
}
