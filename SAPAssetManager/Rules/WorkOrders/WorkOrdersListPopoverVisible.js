import IsIOS from '../Common/IsIOS';
import IsSupervisorSectionVisibleForWO from '../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';

/**
* Returns if true if any of extra items is visible
* @param {IClientAPI} context
*/
export default async function WorkOrdersListPopoverVisible(context) {
    // https://jira.tools.sap/browse/MDKBUG-1424 - popover should be visible only in IOS case
    // for Android all icons should be preseneted without extra popovers
    if (IsIOS(context)) {
        const promises = [
            IsSupervisorSectionVisibleForWO(context),
        ];

        return Promise.all(promises).then(resultsArray => {
            return resultsArray.find(rule => rule === true);
        });
    }
    return Promise.resolve(false);
}
