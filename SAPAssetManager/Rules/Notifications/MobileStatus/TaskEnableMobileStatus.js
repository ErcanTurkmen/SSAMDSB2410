import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default async function TaskEnableMobileStatus(context) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    const isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal && !libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
        return false;
    }

    const received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    const taskMobileStatus = await rereadTaskStatus(context);
    const notificationMobileStatus = libMobile.getMobileStatus(context.binding.Notification || context.binding.Item.Notification, context);

    if (notificationMobileStatus === started) {
        switch (taskMobileStatus) {
            case received:
            case started:
                return true;
            case complete: 
                return libCommon.isAppParameterEnabled(context, 'NOTIFICATION', 'TaskSuccess');
        }
    }

    return false;
}

// reread status to handle refresh issue
function rereadTaskStatus(context) {
    const taskStatus = context.binding.TaskMobileStatus_Nav || context.binding.ItemTaskMobileStatus_Nav || {};
    const taskStatusLink = taskStatus['@odata.readLink'];

    if (taskStatusLink) {
        return libCommon.getEntityProperty(context, taskStatusLink, 'MobileStatus');
    }

    return Promise.resolve('');
}
