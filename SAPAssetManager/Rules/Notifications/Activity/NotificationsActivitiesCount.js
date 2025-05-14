import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsOnlineNotification from '../../OnlineSearch/Notifications/IsOnlineNotification';

export default function NotificationActivitiesCount(clientAPI) {
    const readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    const serviceLink = IsOnlineNotification(clientAPI.getPageProxy()) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/Activities', '', serviceLink);
}
