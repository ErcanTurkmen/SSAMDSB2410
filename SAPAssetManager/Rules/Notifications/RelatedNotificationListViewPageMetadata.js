import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function RelatedNotificationListViewPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/RelatedNotifications.page');
    return ModifyListViewTableDescriptionField(clientAPI, page, 'NotificationHistory');
}
