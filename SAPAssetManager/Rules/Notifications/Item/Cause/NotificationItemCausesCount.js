import CommonLibrary from '../../../Common/Library/CommonLibrary';
import IsOnlineNotificationItem from '../../../OnlineSearch/Notifications/IsOnlineNotificationItem';

export default function NotificationItemTasksCount(clientAPI) {
    const readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    const serviceLink = IsOnlineNotificationItem(clientAPI.getPageProxy()) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/ItemCauses', '', serviceLink);
}
