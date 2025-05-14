import libCom from '../Common/Library/CommonLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import signatureControlCancel from './SignatureControlCancel';
import SignatureRunConfirmationLAM from './Create/SignatureRunConfirmationLAM';
import { IsBulkConfirmationSignatureFlowActive } from '../WorkOrders/Operations/BulkConfirmationLibrary';
import WorkOrderOperationsConfirmation from '../WorkOrders/Operations/WorkOrderOperationsConfirmation';
/**
* Check the assignment type and display the alerts based on App Parameters
* @param {IClientAPI} context
*/
export default function CheckForPermissionBeforeCancel(context) {
    let isSignatureRequired = false;
    if (libMobile.isHeaderStatusChangeable(context)) {
        isSignatureRequired = (libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete')  === 'Y');
    } else if (libMobile.isOperationStatusChangeable(context)) {
        isSignatureRequired = (libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete')  === 'Y');
    } else if (libMobile.isSubOperationStatusChangeable(context)) {
        isSignatureRequired = (libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') === 'Y');
    }
    if (isSignatureRequired) {
        return signatureControlCancel(context).catch(() => {
            // Roll back mobile status update
            return Promise.reject();
        });	 
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return SignatureRunConfirmationLAM(context)
            .then(() => {
                if (IsBulkConfirmationSignatureFlowActive(context)) {
                    return WorkOrderOperationsConfirmation(context);
                }

                return Promise.resolve();
            })
            .catch(() => {
                // Roll back mobile status update
                return Promise.reject();
            });	 
        });
    }
}
