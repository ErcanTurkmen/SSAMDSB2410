import { GetMobileStatusLabel } from '../OperationalItems/Details/OperationalItemMobileStatusTextOrEmpty';
import { CreateTimelineStep } from './WCMActivityTrackerSysStatusStepsData';
import libVal from '../../Common/Library/ValidationLibrary';
import { ProgressStates } from './WCMActivityTrackerStatusStepsData';


/** creates and returns the timelinesteps data from the binding's mobilestatuses, makes the last one selected
 * @param {IClientAPI} context
 * @param {WCMDocumentHeader | WCMDocumentItem} binding
 * @param {string} mobileStatusObjectType
 * @returns {Promise<{ SelectedStepIndex: number, Steps: Array<import('./WCMActivityTrackerSysStatusStepsData').TimelineStep>>}>} */
export default function MobileStatusActivityTrackerStepsData(context, binding, mobileStatusObjectType) {
    return GetMobileStatusWithHistories(context, binding)
        .then((/** @type {PMMobileStatus} */ pmMobileStatus) => pmMobileStatus ? Promise.all([
            ...pmMobileStatus.PMMobileStatusHistory_Nav.map(pmMobileStatusHistory => ConvertMobileStatusToTimelineStep(context, pmMobileStatusHistory, ProgressStates.completed, mobileStatusObjectType)),
            ConvertMobileStatusToTimelineStep(context, pmMobileStatus, ProgressStates.visitedButNotCompleted, mobileStatusObjectType),
        ]) : [])
        .then(steps => ({ SelectedStepIndex: steps.length - 1, Steps: steps }));
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentHeader | WCMDocumentItem} binding
 * @returns {Promise<PMMobileStatus?>} */
function GetMobileStatusWithHistories(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/PMMobileStatus`, [], '$expand=PMMobileStatusHistory_Nav($orderby=EffectiveTimestamp asc)')
        .then(pmMobileStatus => libVal.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));
}

/**
 * @param {IClientAPI} context
 * @param {PMMobileStatus | PMMobileStatusHistory} pmMobileStatus
 * @param {ProgressStates} state
 * @param {string} mobileStatusObjectType
 * @returns {Promise<import('./WCMActivityTrackerSysStatusStepsData').TimelineStep>} */
function ConvertMobileStatusToTimelineStep(context, pmMobileStatus, state, mobileStatusObjectType) {
    return GetMobileStatusLabel(context, pmMobileStatus.MobileStatus, mobileStatusObjectType)
        .then(title => CreateTimelineStep(context, state, title, pmMobileStatus.EffectiveTimestamp, undefined));
}
