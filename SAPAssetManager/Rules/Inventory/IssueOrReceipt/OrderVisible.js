/**
* This function sets the visibility property of the order
* @param {IClientAPI} context
*/
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function OrderVisible(context) {
    return !!(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Order));
}
