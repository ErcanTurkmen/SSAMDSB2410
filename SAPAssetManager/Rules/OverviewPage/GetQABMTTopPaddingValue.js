import CommonLibrary from '../Common/Library/CommonLibrary';
import IsFOWComponentEnabled from '../ComponentsEnablement/IsFOWComponentEnabled';
import IsSupervisorSectionVisibleForOperations from '../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';
import IsSupervisorSectionVisibleForWO from '../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
import isTechnicianSectionVisibleForOperations from '../Supervisor/TechnicianRole/IsTechnicianSectionVisibleForOperations';
import isTechnicianSectionVisibleForWO from '../Supervisor/TechnicianRole/IsTechnicianSectionVisibleForWO';
import IsHighOrdersVisible from './Meter/IsHighOrdersVisible';
import IsRoutesVisible from './Meter/IsRoutesVisible';
import IsQABSectionVisible from './IsQABSectionVisible';

/**
* Getting top padding value for QAB section
* @param {IClientAPI} clientAPI
* visibility props structure: section name - section visibility rule
* no need to put section before QAB component or after 100% visible section
*/

export default async function GetQABMTTopPaddingValue(sectionProxy) {
    let visibilityProps = CommonLibrary.getStateVariable(sectionProxy, 'OverviewMTVisibilityProps');
    if (!visibilityProps) {
        visibilityProps = await getVisibilityPropsOverviewMT(sectionProxy);
        CommonLibrary.setStateVariable(sectionProxy, 'OverviewMTVisibilityProps', visibilityProps);
    }
    const name = sectionProxy.getName();
    if (name) {
        const visibleSections = pageItems.filter(item => visibilityProps[item]);
        // 1st element would be 100% QAB, so checking if section name on the 1st index
        return visibleSections.indexOf(name) !== 1;
    }
    return true;
}

const pageItems = [
    'QuickActionBarExtensionSection',
    'SupervisorSectionForWorkOrders',
    'SupervisorSectionForOperations',
    'HighPriorityOrdersSection',
    'TechnicianSectionForWorkOrders',
    'TechnicianSectionForOperations',
    'MeterRoutesSection',
    'RoutesSection',
    'TimeCaptureSection',
];

async function getVisibilityPropsOverviewMT(sectionProxy) {
    return {
        'QuickActionBarExtensionSection': IsQABSectionVisible(sectionProxy),
        'SupervisorSectionForWorkOrders': await IsSupervisorSectionVisibleForWO(sectionProxy),
        'SupervisorSectionForOperations': await IsSupervisorSectionVisibleForOperations(sectionProxy),
        'HighPriorityOrdersSection': IsHighOrdersVisible(sectionProxy),
        'TechnicianSectionForWorkOrders': await isTechnicianSectionVisibleForWO(sectionProxy),
        'TechnicianSectionForOperations': await isTechnicianSectionVisibleForOperations(sectionProxy),
        'MeterRoutesSection': IsRoutesVisible(sectionProxy),
        'RoutesSection': await IsFOWComponentEnabled(sectionProxy),
        'TimeCaptureSection': true,
    };
}
