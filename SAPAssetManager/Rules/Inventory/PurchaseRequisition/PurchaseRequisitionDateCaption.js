import libCom from '../../Common/Library/CommonLibrary';

/**
* Getting date value from first item of Purchase Requisiition
* supports setting of custom date
* @param {IClientAPI} context
*/
export default function PurchaseRequisitionDateCaption(context, replaceDate) {
    const binding = context.binding;
    if (replaceDate) {
        return formatDate(context, replaceDate);
    }
    if (binding && binding.PurchaseRequisitionItem_Nav && binding.PurchaseRequisitionItem_Nav.length >= 1) {
        let date = binding.PurchaseRequisitionItem_Nav[0].RequisitionDate;
        return formatDate(context, date);
    }
    return '';
}

function formatDate(context, date) {
    if (date) {
        const dateString = libCom.dateStringToUTCDatetime(date);
        const dateText = libCom.getFormattedDate(dateString, context);
        return dateText;
    }
    return '';
}
