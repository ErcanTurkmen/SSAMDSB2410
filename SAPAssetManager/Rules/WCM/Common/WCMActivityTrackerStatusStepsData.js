import { WCMDocumentHeaderMobileStatusType } from '../SafetyCertificates/SafetyCertificatesLibrary';
import MobileStatusActivityTrackerStepsData from './MobileStatusActivityTrackerStepsData';
import WCMActivityTrackerSysStatusStepsData from './WCMActivityTrackerSysStatusStepsData';

/** Enum progress state.
 * @enum {number} */
export const ProgressStates = Object.freeze({
    notVisited: 0,
    visitedButNotCompleted: 1,
    completed: 2,
    error: 3,
    disabled: 4,
});

export default function WCMActivityTrackerStatusStepsData(context) {
    const bindingType = context?.binding?.['@odata.type'];
    if (!bindingType) {
        return [];
    }
    switch (bindingType) {
        case '#sap_mobile.WCMDocumentItem':
            return MobileStatusActivityTrackerStepsData(context, context.binding, context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WCMDocumentItem.global').getValue());
        case '#sap_mobile.WCMDocumentHeader':
            return MobileStatusActivityTrackerStepsData(context, context.binding, WCMDocumentHeaderMobileStatusType);
        default:
            return WCMActivityTrackerSysStatusStepsData(context);
    }
}
