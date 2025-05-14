/**
* This rule sets the visibility of the WBS element in Goods ovement screen
* @param {IClientAPI} context
*/
import IsWBSElementVisible from '../IssueOrReceipt/BulkUpdate/IsWBSElementVisible';
import { InventoryOrderTypes, AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
import libCom from '../../Common/Library/CommonLibrary';
export default function WBSElementVisible(context) {
    const visible = !!(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Project));
    let movementType = context.binding?.MovementType;
    const specialStockInd = context.binding?.SpecialStockInd;
    const movType = libCom.getStateVariable(context, 'IMMovementType');
    if ( movType === InventoryOrderTypes.REV && movementType) {
        movementType = (Number(movementType) + 1).toString();
    }
    return IsWBSElementVisible(context, movementType, specialStockInd).then((wbsElementVisible) => {
        return wbsElementVisible || visible;
    });
}

