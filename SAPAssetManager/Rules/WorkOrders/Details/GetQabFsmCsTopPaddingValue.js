import CommonLibrary from '../../Common/Library/CommonLibrary';
import RejectReasonIsVisible from '../../Supervisor/Reject/RejectReasonIsVisible';
import IsTimelineControlVisible from '../../TimelineControl/IsTimelineControlVisible';
import WorkOrderQABIsVisible from './WorkOrderQABIsVisible';
/**
* Getting top padding value for QAB sections
* @param {IClientAPI} clientAPI
*/
export default async function GetQabFsmCsTopPaddingValue(sectionProxy) {
    let visibilityProps = CommonLibrary.getStateVariable(sectionProxy, 'WODetailsFsmCsVisibilityProps');
    if (!visibilityProps) {
        visibilityProps = await getVisibilityPropsOverviewFSM(sectionProxy);
        CommonLibrary.setStateVariable(sectionProxy, 'WODetailsFsmCsVisibilityProps', visibilityProps);
    }
    const name = sectionProxy.getName();
    if (name) {
        const visibleSections = pageItems.filter(item => visibilityProps[item]);
        // this case is used only when one of the QAB is visible
        if (
            visibilityProps.QuickActionBarExtensionSection
        ) {
            return visibleSections.indexOf(name) !== 1;
        }
    }
    return true;
}

const pageItems = [
    'QuickActionBarExtensionSection',
    'ProgressTrackerExtensionSection',
    'RejectionReason',
    'UserSystemStatuses',
];

async function getVisibilityPropsOverviewFSM(sectionProxy) {
    return {
        'QuickActionBarExtensionSection': await WorkOrderQABIsVisible(sectionProxy),
        'ProgressTrackerExtensionSection': IsTimelineControlVisible(sectionProxy),
        'RejectionReason': RejectReasonIsVisible(sectionProxy),
        'UserSystemStatuses': true,
    };
}
