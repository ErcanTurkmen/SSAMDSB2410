/**
* This function sets the GL account field editable or non editable based on account assgiment
* @param {IClientAPI} context
*/
import { EditableAccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function GLAccountEditable(context) {
    return !(context.binding && isPurchaseOrderItem(context.binding) && EditableAccountAssignments.includes(context.binding.AcctAssgmtCat));
}

