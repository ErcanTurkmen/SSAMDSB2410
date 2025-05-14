/**
* This function sets the visibility of the cost center in goods movement screen
* @param {IClientAPI} context
*/
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function CostCenterVisible(context) {
    return !!(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.CostCenter || context.binding.AcctAssgmtCat === AccountAssignments.Order));
}
