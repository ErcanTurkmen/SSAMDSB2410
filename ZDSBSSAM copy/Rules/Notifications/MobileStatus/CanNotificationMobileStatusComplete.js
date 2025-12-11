import libNotifMobile from './NotificationMobileStatusLibrary';
import sdfIsFeatureEnabled from '../../../../SAPAssetManager/Rules/Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../../../SAPAssetManager/Rules/Forms/SDF/FormInstanceCount';

export default function CanNotificationMobileStatusComplete(context) {
	const promises = [
		libNotifMobile.isAllTasksComplete(context),  // Check if all notification tasks are completed.
		libNotifMobile.isAllItemTasksComplete(context), // Check if all notification item tasks are completed.
	];
	if (context.binding.NotificationType !== '41') {
		promises.push(libNotifMobile.isTasksOnNofificationExists(context));		//DSB customization to check task  exists before completing the notification for type 31.)
	}
	if (sdfIsFeatureEnabled(context)) {
		promises.push(FormInstanceCount(context, true).then((count) => count === 0));
	}
	return Promise.all(promises)
		.then((results) => results.every(result => !!result));
}

