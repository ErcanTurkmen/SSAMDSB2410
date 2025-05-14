/**
* This function sets the editable property of Network activity
* @param {IClientAPI} context
*/
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function NetworkActivityEditable(context) {
    return !(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Network));
}
