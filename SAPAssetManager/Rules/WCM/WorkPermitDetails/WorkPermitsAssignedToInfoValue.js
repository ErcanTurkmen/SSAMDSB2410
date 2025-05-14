import CommonLibrary from '../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../Common/AssignedToLibrary';

export default function WorkPermitsAssignedToInfoValue(context) {
    /** @type {WCMApplication} */
    const binding = context.getPageProxy().binding;
    return AssignedToLibrary.GetAssignedToInfoValue(context, AssignedToLibrary.IsAssignedToVisibleByAssignmentsWorkPermit(CommonLibrary.getWCMApplicationAssignmentTypes(context)), binding.WCMApplicationPartners);
}
