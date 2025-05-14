/**
* Combine Confirmed and requested quantity
* @param {IClientAPI} context
*/
export default function EncodeRequestedQuantity(context, confirmedQty, requirementQty, requirementUOM) {
    return `${confirmedQty} / ${context.formatNumber(Number(requirementQty))} ${requirementUOM}`;
}


