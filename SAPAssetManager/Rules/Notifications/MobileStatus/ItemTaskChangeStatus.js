import libTaskMobile from '../Item/Task/ItemTaskMobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function ItemTaskChangeStatus(context) {
    context.showActivityIndicator('');
    const started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const received = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    return libTaskMobile.readHeaderMobileStatus(context).then(headerStatus => {
        if (headerStatus) {
            if (headerStatus === started) {
                return libTaskMobile.readTaskMobileStatus(context).then(status => {
                    if (status) {
                        return processStatus(context, status, received, started, completed);
                    }
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusFailureMessage.action');
                });
            } else {
                context.dismissActivityIndicator();
                return '';
            }
        }
        context.dismissActivityIndicator();
        return '';
    });
}

function processStatus(context, status, received, started, completed) {
    if (status === received) {
        return libTaskMobile.startTask(context).then(() => {
            return ToolbarRefresh(context);
        });
    } else if (status === started) {
        if (libComm.getTaskSucessFlag(context) === 'Yes') {
            return libTaskMobile.completeTask(context).then(() => {
                return ToolbarRefresh(context);
            });
        } else {
            return libTaskMobile.completeTaskWithoutSuccessFlag(context).then(() => {
                return ToolbarRefresh(context);
            });
        }
    } else if (status === completed) {
        return libTaskMobile.successTask(context).then(() => {
            return ToolbarRefresh(context);
        });
    } else {
        context.dismissActivityIndicator();
        return '';
    }
}
