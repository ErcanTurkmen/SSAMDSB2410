import libTaskMobile from '../Task/TaskMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';
import CanNotificationMobileStatusComplete from './CanNotificationMobileStatusComplete';

export default function TaskChangeStatus(context) {
    const started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const received = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    const binding = context.getPageProxy().getActionBinding() || context.binding;
    const notifMobileStatus = libMobile.getMobileStatus(binding.Notification, context);

    context.showActivityIndicator('');

    if (notifMobileStatus === started) {
        const notifTaskMobileStatus = libMobile.getMobileStatus(binding, context);

        if (notifTaskMobileStatus === received) {
            return libTaskMobile.startTask(context).then(() => {
                return onFinishStatusUpdate(context);
            });
        } else if (notifTaskMobileStatus === started) {
            if (libComm.isAppParameterEnabled(context, 'NOTIFICATION', 'TaskSuccess')) {
                return libTaskMobile.completeTask(context)
                .then(() => {
                    return onFinishStatusUpdate(context);
                });
            } else {
                return libTaskMobile.completeTaskWithoutSuccessFlag(context)
                .then(() => {
                    return onFinishStatusUpdate(context);
                });
            }
        } else if (notifTaskMobileStatus === completed) {
            return libTaskMobile.successTask(context)
            .then(() => {
                return onFinishStatusUpdate(context);
            });
        }
    }
    context.dismissActivityIndicator();
    return '';
}

function onFinishStatusUpdate(context) {
    const isChangedFromCard = libComm.getPageName(context) === NotificationDetailsPageName(context);

    return isChangedFromCard ? enableNotificationComplete(context) : ToolbarRefresh(context);
}

function enableNotificationComplete(context) {
    return CanNotificationMobileStatusComplete(context).then(allowed => {
        if (allowed) {
            context.getFioriToolbar()?.getItem('P_COMPLETED')?.setEnabled(allowed);
        }
    });
}
