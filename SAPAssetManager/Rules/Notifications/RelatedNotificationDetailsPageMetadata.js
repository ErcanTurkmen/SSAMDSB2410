import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function RelatedNotificationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/RelatedNotificationsDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkOrderHistoryDetailsSection');
}
