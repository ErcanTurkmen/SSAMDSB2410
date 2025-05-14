import CommonLibrary from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

//disable technician signature removal after work order/operation is completed and signature is mandatory
export default function ContextMenuTrailingItemsForSignature(context, binding, actions = []) {
    if (binding) {
        return isSignatureDeleteEnabled(context, binding).then(isEnabled => {
            return isEnabled ? actions : [];
        });
    }

    return Promise.resolve(actions);
}

export function isSignatureDeleteEnabled(context, binding, isEnabledByDefault = true, documentPropertyName = 'Document') {
    const operationSignatureMandatory = CommonLibrary.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'Y';
    const workorderSignatureMandatory = CommonLibrary.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'Y';
    const signaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentTechnicianSignaturePrefix.global').getValue();
    const customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
   
    if (binding && binding.OperationNo && binding.OrderId) {
        if (operationSignatureMandatory) {
            return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderOperations', binding.OrderId, binding.OperationNo).then(completed => {
                let fileName = binding[documentPropertyName].FileName;
                const isCompleted = checkIsCompleted(completed, fileName, signaturePrefix, customerSignaturePrefix);
                if (isCompleted) {
                    return false;
                }
                return isEnabledByDefault;
            });
        }
    } else if (binding && binding.OrderId && workorderSignatureMandatory) {
        return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', binding.OrderId).then(completed => {
            let fileName = binding[documentPropertyName].FileName;
            const isCompleted = checkIsCompleted(completed, fileName, signaturePrefix, customerSignaturePrefix);
            if (isCompleted) {
                return false;
            }
           return isEnabledByDefault;
        });
    }

    return Promise.resolve(isEnabledByDefault);
}

function checkIsCompleted(completed, fileName, signaturePrefix, customerSignaturePrefix) {
    return completed && (fileName.startsWith(signaturePrefix) || fileName.startsWith(customerSignaturePrefix));
}
