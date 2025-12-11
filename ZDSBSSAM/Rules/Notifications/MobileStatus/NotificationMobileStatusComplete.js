import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusUpdateOverride from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusUpdateOverride';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import HideActionItems from '../../../../SAPAssetManager/Rules/Common/HideActionItems';
import LocationUpdate from '../../../../SAPAssetManager/Rules/MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import CanNotificationMobileStatusComplete from '../../../../SAPAssetManager/Rules/Notifications/MobileStatus/CanNotificationMobileStatusComplete';
import sdfIsFeatureEnabled from '../../../../SAPAssetManager/Rules/Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../../../SAPAssetManager/Rules/Forms/SDF/FormInstanceCount';
import { NotificationDetailsPageName } from '../../../../SAPAssetManager/Rules/Notifications/Details/NotificationDetailsPageToOpen';
import AnalyticsManager from '../../../../SAPAssetManager/Rules/AnalyticsManager/AnalyticsManagerLibrary';

export default function NotificationMobileStatusComplete(context) {
	//Get statusElement that was set in NotificationChangeStatusOptions.js. It will be used later on to pass into MobileStatusUpdateOverride.js which updates the mobile status in db.
	let statusElement = CommonLibrary.getStateVariable(context, 'StatusElement');
	const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	if (statusElement.MobileStatus === COMPLETED) {

		//Don't allow notification to be completed if all notification tasks and notification item tasks are not complete.
		return CanNotificationMobileStatusComplete(context).then(async canComplete => {
			if (canComplete) {
				return libNotifMobile.isNotifActivityExists(context).then(async activityExists => {	// DSB customisation to check the activities and item cause before completion
					if (activityExists) {
						return libNotifMobile.isItemCauseExists(context).then(async causeExists => {	// DSB customisation to check the activities and item cause before completion
							if (causeExists) {
								return libNotifMobile.NotificationUpdateMalfunctionEnd(context).then(() => {
									//libNotifMobile.completeNotification does digital signature and device registration. The function name is misleading.
									return libNotifMobile.completeNotification(context, dummyFunction).then(() => {
										LocationUpdate(context);
										//Update the mobile status to complete in db
										return context.executeAction(MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', '')).then(() => {
											let pageContext = MobileStatusLibrary.getPageContext(context, NotificationDetailsPageName(context));
											context.getFioriToolbar().setVisible(false);
											HideActionItems(pageContext.getPageProxy(), 2);
											return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
												CommonLibrary.removeStateVariable(context, 'StatusElement');
												return pageContext.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
												//DSB customisation to remove autosync on status change - complete
												//AutoSyncLibrary.autoSyncOnStatusChange(pageContext);
											}).then(() => {
												//Add AnalyticsManager Check here
												AnalyticsManager.notificationCompleteSuccess();
											});
										});
									});
								});
							}
							else {
								return context.executeAction('/ZDSBSSAM/Actions/Notifications/MobileStatus/NotificationCausePendingError.action');
							}
						});
				}
				else {
					return context.executeAction('/ZDSBSSAM/Actions/Notifications/MobileStatus/NotificationActivityPendingError.action');
				}
				});
			}
			let errorAction = '/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action';
			if (sdfIsFeatureEnabled(context)) {
				const count = await FormInstanceCount(context, true);
				if (count > 0) {
					errorAction = '/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationFormPendingError.action';
				}
			}
			return context.executeAction(errorAction);
		}).catch((error) => {
			Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
			return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
		});
	}

	//The NotificationMobileStatusLibrary.completeNotification function requires a function to be passed in that it calls once it's done.
	//We don't want its default function executeCompletionStepsAfterDigitalSignature() to be called in this case.
	//NotificationMobileStatusLibrary.completeNotification just does digital signature. It should be called doDigitalSignature(context) instead.
	//I don't want to mess with existing code, so I just created a simple dummy function here to pass in that does nothing.
	function dummyFunction() {
		return Promise.resolve();
	}
}
