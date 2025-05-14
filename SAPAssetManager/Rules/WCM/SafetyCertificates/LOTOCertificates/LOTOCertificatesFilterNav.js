/** @typedef LOTOCertificatesListFilterBinding
 * @prop {string} selectedTab
 */

import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetWCMCertificateAssignedToMePickerItem } from '../OtherCertificatesFilterPageNav';

/** @param {IPageProxy} context  */
export default function LOTOCertificatesFilterNav(context) {
    const assignments = CommonLibrary.getWCMDocumentAssignmentTypes(context);
    /** @type {LOTOCertificatesListFilterBinding & import('../../../Filter/FilterLibrary').FilterPageBinding & import('../../Common/AssignedToLibrary').TypeAssignedToBinding} */
    const filterPageBinding = {
        selectedTab: context.getPageProxy().getControls()[0].getSelectedTabItemName(),
        DefaultValues: {
            SortFilter: 'Priority',
        },
        assignmentTypes: assignments,
        PartnersNavPropName: 'WCMDocumentPartners',
        AssignedToMePickerItem: GetWCMCertificateAssignedToMePickerItem(assignments, context),
    };
    context.setActionBinding(filterPageBinding);
    return context.executeAction('/SAPAssetManager/Actions/WCM/LOTOCertificatesFilter.action');
}
