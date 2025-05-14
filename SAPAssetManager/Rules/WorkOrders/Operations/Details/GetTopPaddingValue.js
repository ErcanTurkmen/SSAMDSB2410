import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RejectReasonIsVisible from '../../../Supervisor/Reject/RejectReasonIsVisible';
import IsTimelineControlVisible from '../../../TimelineControl/IsTimelineControlVisible';

export default function GetTopPaddingValue(sectionProxy) {
    let visibilityProps = CommonLibrary.getStateVariable(sectionProxy, 'OPDetailsFsmCsVisibilityProps');
    if (!visibilityProps) {
        visibilityProps = getVisibilityPropsForSections(sectionProxy);
        CommonLibrary.setStateVariable(sectionProxy, 'OPDetailsFsmCsVisibilityProps', visibilityProps);
    }
    
    const name = sectionProxy.getName();
    if (name) {
        const visibleSections = pageItems.filter(item => visibilityProps[item]);
        // this case is used only when QAB is visible
        if (visibilityProps.QuickActionBarExtensionSection) {
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

function getVisibilityPropsForSections(sectionProxy) {
    return {
        'QuickActionBarExtensionSection': true,
        'ProgressTrackerExtensionSection': IsTimelineControlVisible(sectionProxy),
        'RejectionReason': RejectReasonIsVisible(sectionProxy),
        'UserSystemStatuses': true,
    };
}
