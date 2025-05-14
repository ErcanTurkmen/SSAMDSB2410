import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function NotificationItemActivityDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationItemActivityDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationItemActivityDetailsSection');
}
