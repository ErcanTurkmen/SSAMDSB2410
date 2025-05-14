/**
* This function sets the visibility of the network and network activity in Goods movement screen
* @param {IClientAPI} context
*/
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function NetworkVisible(context) {
    return !!(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Network));
}
