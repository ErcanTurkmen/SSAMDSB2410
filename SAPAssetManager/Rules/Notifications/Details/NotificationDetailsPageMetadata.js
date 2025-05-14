import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import NotificationDetailsPageToOpen from './NotificationDetailsPageToOpen';

export default async function NotificationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition(NotificationDetailsPageToOpen(clientAPI));

    if (IsPhaseModelEnabled(clientAPI)) {
        return await ModifyKeyValueSection(clientAPI, page, 'NotificationDetailsSectionPhaseModel');
    } else {
        return await ModifyKeyValueSection(clientAPI, page, 'NotificationDetailsSection');
    }
}
