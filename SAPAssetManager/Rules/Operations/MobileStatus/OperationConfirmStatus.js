import libOpMobile from './OperationMobileStatusLibrary';

/**
* Confirm operation from details page
* @param {IClientAPI} context
*/
export default function OperationConfirmStatus(context) {
    context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which may result in infinite loading when CheckRequiredFields action is executed.
    return libOpMobile.completeOperation(context);
}
