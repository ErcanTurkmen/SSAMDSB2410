import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

/**
 * Common function to get object card button visibility. Takes in transaction type(s) and returns visibility value for button
 * @param {*} context 
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {boolean} [findAll=false] indicates if options with all passed transition types should be defined for object card button to be visible
 * @returns object card button visibility value
 */
export default async function ObjectCardButtonVisible(context, transitionTypes = [], findAll = false) {
    const binding = context.binding;
    const objectType = MobileStatusLibrary.getMobileStatusNavLink(context)?.OverallStatusCfg_Nav?.ObjectType;
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
    
    if (findAll) {
       return options.filter(item => transitionTypes.includes(item.TransitionType)).length > 1;
    }
    
    const action = options.find(item => transitionTypes.includes(item.TransitionType));
    return CommonLibrary.isDefined(action);
}

export async function reloadUserTimeEntriesForLocalStatus(context, binding) {
    const mobileStatusObject = MobileStatusLibrary.getMobileStatusNavLink(context, binding);
    
    if (mobileStatusObject['@sap.hasPendingChanges']) {
        await ClockInClockOutLibrary.reloadUserTimeEntries(context, false, undefined, binding);
    }
}
