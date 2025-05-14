import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function NotificationItemCauseDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemCauseDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationItemCauseDetailsSection');
}
