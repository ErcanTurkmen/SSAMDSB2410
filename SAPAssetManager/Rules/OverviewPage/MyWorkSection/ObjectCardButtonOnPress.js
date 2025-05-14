import { StatusTransitionTextsVar } from '../../Common/Library/GlobalStatusTransitionTexts';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import RunMobileStatusUpdateSequence, { getUpdateToStatusConfig } from '../../MobileStatus/RunMobileStatusUpdateSequence';
import { reloadUserTimeEntriesForLocalStatus } from './ObjectCardButtonVisible';

/**
 * Common function to get object card button OnPress action. Takes in transaction type(s) and executes corresponding on press action
 * @param {*} context 
 * @param {*} binding 
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {Function} [sortOptionsFunction] optional function to sort status options
 * @returns either status update sequence or error message, if needed action is not found
 */
export default async function ObjectCardButtonOnPress(context, binding, transitionTypes) {
    const objectType = MobileStatusLibrary.getMobileStatusNavLink(context, binding)?.OverallStatusCfg_Nav?.ObjectType;
    let currentStatusOverride = null;

    await reloadUserTimeEntriesForLocalStatus(context, binding); 

    if ([
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue(),
    ].includes(objectType)) {
        currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    const options = await StatusGeneratorWrapper.generateMobileStatusOptions();
    
    const action = options.find(item => transitionTypes.includes(item.TransitionType));

    if (action) {
        const mobileStatusForTextKey = StatusTransitionTextsVar.getStatusTransitionTexts(objectType)?.[action.Title];
        const updateToStatus = await getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType);
        context.getPageProxy().setActionBinding(binding);
        return RunMobileStatusUpdateSequence(context, binding, updateToStatus);
    }

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}
