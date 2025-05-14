import libCom from '../Common/Library/CommonLibrary';
import viewEntity from './PushNotificationsViewEntityNav';
import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import notificationNavQuery from '../Notifications/Details/NotificationDetailsQueryOptions';
import Logger from '../Log/Logger';
import downloadFailure from './PushNotificationsDownloadFailureAlertMessage';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import PersonaLibrary from '../Persona/PersonaLibrary';
export default function PushNotificationsDownloadSuccessAlertMessage(context) {
    setSyncInProgressState(context, false);
    let objectType = libCom.getStateVariable(context, 'ObjectType');
    let titleLocArgs = libCom.getStateVariable(context, 'TitleLocArgs');
    let view = context.localizeText('view');
    let dismiss = context.localizeText('cancel');
    let entity = '';
    let queryOptions = '';
    let messageText = '';

    const entityMap = {
        'WorkOrder': `MyWorkOrderHeaders('${titleLocArgs}')`,
        'Notification': `MyNotificationHeaders('${titleLocArgs}')`,
        'ServiceOrder': 'S4ServiceOrders',
    };

    const queryOptionsMap = {
        'WorkOrder': libWo.getWorkOrderDetailsNavQueryOption(context),
        'Notification': notificationNavQuery(context),
        'ServiceOrder': `$filter=HeaderGUID32 eq '${titleLocArgs}'`,
    };

    const technicalObjectNameMap = {
        'WorkOrder': context.localizeText(`${PersonaLibrary.isFieldServiceTechnician(context) ? 'serviceorder' : 'workorder'}`),
        'Notification': context.localizeText('notification'),
        'ServiceOrder': context.localizeText('serviceorder'),
    };

    const messageTextMap = {
        'WorkOrder': context.localizeText('push_download_complete', [titleLocArgs, technicalObjectNameMap.WorkOrder]),
        'Notification': context.localizeText('push_download_complete', [titleLocArgs, technicalObjectNameMap.Notification]),
        'ServiceOrder': context.localizeText('push_download_complete_serviceorder'),
    };

    if (Object.hasOwn(entityMap, objectType)) {
        entity = entityMap[objectType];
        queryOptions = queryOptionsMap[objectType];
        messageText = messageTextMap[objectType];
    } else {
        return Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue(), 'Push is not implemented for ' + objectType + ' entity set');
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then((result) => {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadComplete.action').then(()=> {
            if (result && result.getItem(0)) {
                return libCom.showWarningDialog(context,messageText,context.localizeText('download_complete'),view, dismiss).then(() => {
                    return viewEntity(context);
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue(), error);
                    return '';
                });
            }
            return '';
        });
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue(), error);
        return downloadFailure(context);
    });
}
