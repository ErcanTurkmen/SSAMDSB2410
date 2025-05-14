import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function NotificationItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationItemDetailsSection');
}
