import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import enablenotifedit from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationEdit';

export default function ZNotificationItemEditVisible(context) {
	// Edit notification item disabled for 31 and 41. Users willedit notification and update the object part text and damage text rather than from edit item page
	if (enablenotifedit) {
		let notifLookup, binding;
		if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
			binding = context.binding.Notification;
			notifLookup = Promise.resolve(binding.NotificationType);
		}
		if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationItemCause') {
			binding = context.binding.Item;
			binding = binding.Notification;
			notifLookup = Promise.resolve(binding.NotificationType);
		}
		return notifLookup.then(type => {
			if (type === '31' || type === '41') {
				return false;
			}
			else
				return true;
		});
	}
	else
		return false;
}
