import libNotifMobile from './NotificationMobileStatusLibrary';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';

export default function CanNotificationMobileStatusComplete(context) {
	const promises = [
		libNotifMobile.isAllTasksComplete(context),  // Check if all notification tasks are completed.
		libNotifMobile.isAllItemTasksComplete(context), // Check if all notification item tasks are completed.
	];
	if (sdfIsFeatureEnabled(context)) {
		promises.push(FormInstanceCount(context, true).then((count) => count === 0));
	}
	return Promise.all(promises)
	.then((results) => results.every(result => !!result));
}
