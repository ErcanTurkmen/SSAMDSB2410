import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function NotificationMobileStatusSuccessMessage(context) {
    LocationUpdate(context);
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        const status = clientData.ChangeStatus;
        const started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        switch (status) {
            case started:
                return context.localizeText('notification_started');
            case completed:
                return context.localizeText('notification_completed');
            default:
                return context.localizeText('status_updated');
        }
    }
    return context.localizeText('status_updated');
}
