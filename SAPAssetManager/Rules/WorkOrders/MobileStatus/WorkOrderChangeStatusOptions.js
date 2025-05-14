import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';

/**
 * Populates the Work Order Mobile Status options
 * @param {IPageProxy} context 
 * @returns {Promise<Array>} array of toolbar items
 */
export default function WorkOrderChangeStatusOptions(context, actionBinding, rereadStatus = false) {
    const binding = actionBinding || getBindingObject(context);
    const currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();

    // Return empty list for Work Orders without mobile status (WCM orders in some state)
    if (libVal.evalIsEmpty(binding?.OrderMobileStatus_Nav)) {
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
