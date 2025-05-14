import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function NotificationItemTaskDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemTaskDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationItemTaskDetailsSection');
}
