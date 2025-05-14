import AllSyncronizationGroups from '../OData/DefiningRequests/AllSyncronizationGroups';

export default function PushNotificationsDownloadProgressBannerOnSuccess(context) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownload.action',
        'Properties': {
            'DefiningRequests': AllSyncronizationGroups(context),
            'OnSuccess': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadSuccessAlertMessage.js',
            'OnFailure': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadFailureAlertMessage.js',
        },
    });
}
