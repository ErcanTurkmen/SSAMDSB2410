import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import IsServiceOrderReleased from './IsServiceOrderReleased';

export default function ShowAddConfirmationDialog(context) {
    const updateResult = MobileStatusUpdateResultsClass.getInstance().getActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE);
    
    return IsServiceOrderReleased(context, updateResult).then(isReleased => {
        if (isReleased) {
            return libMobile.showWarningMessage(context, context.localizeText('confirmations_add_item_message')).then(confirmed => {
                MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM_DIALOG, confirmed);
                return Promise.resolve();
            });
        }
        
        MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM_DIALOG, false);
        return Promise.resolve();
    });
}
