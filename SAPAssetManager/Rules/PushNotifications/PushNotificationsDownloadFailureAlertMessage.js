import libCom from '../Common/Library/CommonLibrary';
import downloadPush from './PushNotificationsDownload';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';

export default function PushNotificationsDownloadFailureAlertMessage(context) {
    setSyncInProgressState(context, false);
    let objectType = libCom.getStateVariable(context, 'ObjectType');
    let titleLocArgs = libCom.getStateVariable(context, 'TitleLocArgs');
    let title = context.localizeText('download_incomplete');

    let technicalObjectName;
    let messageText = '';
    let objectTypeMap = {
        'WorkOrder': 'workorder',
        'Notification': 'notification',
        'ServiceOrder': 'serviceorder',
    };

    if (Object.hasOwn(objectTypeMap, objectType)) {
        technicalObjectName = context.localizeText(objectTypeMap[objectType]);
        messageText = objectType === 'ServiceOrder' ? context.localizeText('push_download_incomplete_serviceorder') : context.localizeText('push_download_incomplete', [titleLocArgs, technicalObjectName]);
    }

    return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadIncomplete.action').then(()=> {
        return libCom.showWarningDialog(context, messageText, title, context.localizeText('tryAgain'), context.localizeText('later')).then((result) => {
            if (result === true) {
                setSyncInProgressState(context, true);
                downloadPush(context, objectType);
            }
            return '';
        });
    });

}
