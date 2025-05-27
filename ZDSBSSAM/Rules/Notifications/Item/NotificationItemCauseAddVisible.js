import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libNotifMobile from '../../../../SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationItemCauseAddVisible(context) {
	// Only 1 cause can be added
    var readLink = context.binding['@odata.readLink'];
    Logger.error("Item read link", readLink);
    return libCom.getEntitySetCount(context, readLink + '/ItemCauses', '').then(count => {
    	if (count > 0){
    		return false;
    	}
    	return true;
    });
}
