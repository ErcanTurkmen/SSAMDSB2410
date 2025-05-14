import libCom from '../../Common/Library/CommonLibrary';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libServiceConfirmation from '../../ServiceConfirmations/CreateUpdate/ServiceConfirmationLibrary';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';

export default function ShowAddConfirmationDialog(context) {
    const addItemConfirmed = MobileStatusUpdateResultsClass.getInstance().getActionResult(SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM_DIALOG);
    
    if (libCom.isDefined(addItemConfirmed) && addItemConfirmed) {
        return libServiceConfirmation.getInstance().openConfirmatioPageForHoldFlow(context);
    }

    return Promise.resolve();
}
