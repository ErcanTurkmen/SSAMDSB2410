import libComm from '../../Common/Library/CommonLibrary';
export default function TaskMobileStatusFailureMessage(context) {
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        const status = clientData.ChangeStatus;
        const started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const success = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
        switch (status) {
            case started:
                return context.localizeText('task_cannot_be_started');
            case completed:
                return context.localizeText('task_cannot_be_completed');
            case success:
                return context.localizeText('task_cannot_be_successful');
            default:
                return context.localizeText('status_cannot_be_updated');
        }
    }
    return context.localizeText('status_cannot_be_updated');
}
