import libCom from '../../Common/Library/CommonLibrary';
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function WBSElementEditable(context) {
    const data = libCom.getStateVariable(context, 'FixedData');

    if (data && data.project) {
        return false;
    }
    return !(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Project));
}
