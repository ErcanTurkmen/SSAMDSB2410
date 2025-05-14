/**
* Get array of values to desribe in formatted tags for PR
* @param {IClientAPI} context
*/
export default function PurchaseRequisitionFromattedTags(context) {
    const binding = context.binding;
    const tags = [];
    tags.push(context.localizeText('open'));
    if (binding && binding.PurchaseRequisitionItem_Nav && binding.PurchaseRequisitionItem_Nav.length >= 1) {
        let type = binding.PurchaseRequisitionItem_Nav[0].DocType;
        if (type) {
            tags.push(type);
        }
    }
    return tags;
}
