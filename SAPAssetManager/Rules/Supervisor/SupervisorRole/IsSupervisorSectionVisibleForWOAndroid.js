import IsSupervisorSectionVisibleForWO from './IsSupervisorSectionVisibleForWO';
import IsAndroid from '../../Common/IsAndroid';

/**
 * Displays the Supervisor section containing pending Work Orders for review when the user is in the Supervisor Role.
 * @param {*} context 
 */
export default function IsSupervisorSectionVisibleForWOAndroid(context) {
    if (IsAndroid(context)) {
        return IsSupervisorSectionVisibleForWO(context);
    }
    return false;
}
