import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';

export default function OperationChangeStatusOptions(context, actionBinding, rereadStatus = false) {
    const binding = actionBinding || getBindingObject(context);
    const currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();

    // Return empty list for Operations without mobile status (WCM orders in some state)
    if (libVal.evalIsEmpty(binding?.OperationMobileStatus_Nav)) {
        return Promise.resolve([]);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}

function getBindingObject(context) {
    let binding = context.binding;
    
    if (!libCom.isDefined(binding)) {
        const pageProxy = context.getPageProxy?.() || context;
        binding = pageProxy.getActionBinding();
    }

    return binding;
}
