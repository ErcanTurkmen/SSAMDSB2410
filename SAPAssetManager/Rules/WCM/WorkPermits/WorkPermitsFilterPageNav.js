import CommonLibrary from '../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../Common/AssignedToLibrary';

export default function WorkPermitsFilterPageNav(context) {
    const assignments = CommonLibrary.getWCMApplicationAssignmentTypes(context);
    const assignedToMePickerItem = AssignedToLibrary.IsAssignedToVisibleByAssignmentsWorkPermit(assignments) ? {
        DisplayValue: context.localizeText('assigned_to_me'),
        ReturnValue: AssignedToLibrary.GetAssignedToMeReturnValue('WCMApplicationPartners'),
    } : undefined;
    /** @type {import('../../Filter/FilterLibrary').FilterPageBinding & import('../Common/AssignedToLibrary').TypeAssignedToBinding} */
    const binding = {
        DefaultValues: { SortFilter: 'Priority' },
        assignmentTypes: assignments,
        PartnersNavPropName: 'WCMApplicationPartners',
        AssignedToMePickerItem: assignedToMePickerItem,
    };
    context.setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/WCM/WorkPermitsFilter.action');
}
