import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function NotificationTaskDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationTaskDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'NotificationTaskDetailsSection');
}
