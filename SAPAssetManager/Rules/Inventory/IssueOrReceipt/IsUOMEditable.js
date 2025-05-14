export default function IsUOMEditable(context, bindingObject = undefined) {
    const binding = bindingObject || context.binding;
    if (!binding) {
        return false;
    }
    let material = '';
    material = binding.MaterialNum || binding.Material;
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
        return false;
    }

    return !!material;
}
