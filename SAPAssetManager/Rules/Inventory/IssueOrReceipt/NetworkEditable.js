import libCom from '../../Common/Library/CommonLibrary';
import { AccountAssignments } from '../Common/Library/InventoryLibrary';
import { isPurchaseOrderItem } from '../Item/AcctAssgmtVisible';
export default function NetworkEditable(context) {
    const data = libCom.getStateVariable(context, 'FixedData');
    if (data && data.network) {
        return false;
    }
    return !(context.binding && isPurchaseOrderItem(context.binding) && (context.binding.AcctAssgmtCat === AccountAssignments.Network));
}
