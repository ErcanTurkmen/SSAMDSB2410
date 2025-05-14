/**
* This function sets the visibility property of the account assignment field
* @param {IClientAPI} context
*/
import { EditableAccountAssignments } from '../Common/Library/InventoryLibrary';

export default function AcctAssgmtVisible(context) {
    return context.binding && isPurchaseOrderItem(context.binding) && EditableAccountAssignments.includes(context.binding.AcctAssgmtCat);
}

export function isPurchaseOrderItem(bindingObject) {
    return bindingObject?.['@odata.type'].substring('#sap_mobile.'.length) === 'PurchaseOrderItem';
}
