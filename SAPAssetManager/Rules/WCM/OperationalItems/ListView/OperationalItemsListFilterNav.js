import CommonLibrary from '../../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../../Common/AssignedToLibrary';
import { OperationalItemPartnerAssignedToMeFilterTerm, OperationalItemSelVarAssignedToMeFilterTerm } from './ConstructOperationalItemsListViewTabs';

/**
 * @typedef OperationalItemsListFilterBinding
 * @prop {string} selectedTab
 */

/** @param {IPageProxy} context  */
export default function OperationalItemsListFilterNav(context) {
    const assignments = CommonLibrary.getWCMDocumentAssignmentTypes(context);
    let assignedToMePickerItem = undefined;
    if (AssignedToLibrary.IsAssignedToVisibleByAssignmentsPartnerOperationalItem(assignments)) {
        assignedToMePickerItem = { DisplayValue: context.localizeText('assigned_to_me'), ReturnValue: OperationalItemPartnerAssignedToMeFilterTerm() };
    } else if (AssignedToLibrary.IsAssignedToVisibleByAssignmentsSVOperationalItem(assignments)) {
        assignedToMePickerItem = { DisplayValue: context.localizeText('assigned_to_me'), ReturnValue: OperationalItemSelVarAssignedToMeFilterTerm() };
    }

    /** @type {OperationalItemsListFilterBinding & import('../../../Filter/FilterLibrary').FilterPageBinding & import('../../Common/AssignedToLibrary').TypeAssignedToBinding} */
    const binding = {
        selectedTab: context.getPageProxy().getControls()[0].getSelectedTabItemName(),
        DefaultValues: {
            SortFilter: 'WCMDocumentHeaders/Priority',
        },
        PartnersNavPropName: 'WCMDocumentHeaders/WCMDocumentPartners',
        assignmentTypes: assignments,
        AssignedToMePickerItem: assignedToMePickerItem,
    };
    context.setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemsListFilterNav.action');
}
