import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function NotificationActivityDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationActivityDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationActivityDetailsSection');
}
