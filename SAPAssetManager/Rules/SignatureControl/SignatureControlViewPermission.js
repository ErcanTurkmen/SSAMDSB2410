import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libVal from '../Common/Library/ValidationLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
/**
* Check if the Signature Control is enabled and set the client data to keep track
* @param {IClientAPI} context
*/
export default function SignatureControlViewPermission(context, mobileStatus) {
    let isSignatureEnabled = false;
    libCommon.setStateVariable(context, 'ContextMenuBindingObject', null);
    const isS4SidePanelEnabled = IsS4ServiceIntegrationEnabled(context);

    if (libMobile.isHeaderStatusChangeable(context) || (libMobile.isServiceOrderStatusChangeable(context) && isS4SidePanelEnabled)) {
        isSignatureEnabled = checkIsSignatureEnabled(context, 'WO.Complete', mobileStatus);
    } else if (libMobile.isOperationStatusChangeable(context) || (libMobile.isServiceItemStatusChangeable(context) && isS4SidePanelEnabled)) {
        isSignatureEnabled = checkIsSignatureEnabled(context, 'OP.Complete', mobileStatus);
    } else if (libMobile.isSubOperationStatusChangeable(context)) {
        isSignatureEnabled = checkIsSignatureEnabled(context, 'SubOp.Complete');
        
    }
    if (isSignatureEnabled) {
        if (!context.getPageProxy().getClientData().didShowSignControl) { // set the flag to avoid showing it again when adding time
            libCommon.setStateVariable(context, 'LAMSignature', true);
            ///check if signature creation was called from context menu
            if (context.getPageProxy().getExecutedContextMenuItem()) {
                libCommon.setStateVariable(context, 'ContextMenuBindingObject', context.getPageProxy().getExecutedContextMenuItem().getBinding());
            }
            return executeSignatureAction(context);
        }
    }
    // If the Signature Control parameters is not present, by default it is not required so we will proceed
    return Promise.resolve(true);
}

function checkIsSignatureEnabled(context, signCaptureParam, mobileStatus) {
    const reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const disapproveStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());

    let isSignatureEnabled = !libVal.evalIsEmpty(libCommon.getAppParam(context, 'SIGN_CAPTURE', signCaptureParam)) && (libCommon.getAppParam(context, 'SIGN_CAPTURE', signCaptureParam) !== 'N');
    if (isSignatureEnabled && mobileStatus && (mobileStatus === reviewStatus || mobileStatus === disapproveStatus)) {
        isSignatureEnabled = libSuper.isSupervisorSignatureEnabled(context);
    }
    return isSignatureEnabled;
}

function executeSignatureAction(context) {
    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action').then(() => {
        context.getPageProxy().getClientData().didShowSignControl = true; // set the flag to avoid showing it again when adding time
        return true;
    }).catch(err => {
        context.dismissActivityIndicator();
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySignature.global').getValue(), err);
        return Promise.reject(false);
    });
}
