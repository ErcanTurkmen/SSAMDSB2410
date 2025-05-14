/**
* Getting and modifying long text for display in Purchase Requisition header
* Supports insert of custom binging from the side
* @param {IClientAPI} context
*/
export default function PurchaseRequisitionItemLongText(context, customBinding) {
    const binding = context.binding;
    if (customBinding) {
        return getLongText(customBinding);
    }
    if (binding) {
        return getLongText(binding);
    }
    return '';
}

function getLongText(binding) {
    if (binding.PurchaseRequisitionLongText_Nav && binding.PurchaseRequisitionLongText_Nav.length >= 1) {
        return binding.PurchaseRequisitionLongText_Nav.reduce((acc, val) => {
            return val && val.TextString ? `${acc}${val.TextString}\n` : acc;
        }, '');
    }
    return '';
}
