import libOpMobile from './OperationMobileStatusLibrary';
import ZOperationConfirm from './ZOperationConfirm';

/**
* Confirm operation from details page
* @param {IClientAPI} context
*/
export default function OperationConfirmStatus(context) {
    context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which may result in infinite loading when CheckRequiredFields action is executed.
    ZOperationConfirm(context);         //DSB customization to confirm operations
    //return libOpMobile.completeOperation(context);
}
