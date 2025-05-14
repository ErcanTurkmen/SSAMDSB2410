import libCommon from '../../Common/Library/CommonLibrary';
export default function WorkOrderMobileStatusFailureMessage(context) {
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        const status = clientData.ChangeStatus;
        const woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        const woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        const woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        switch (status) {
            case woStarted:
                return context.localizeText('workorder_cannot_be_started');
            case woHold:
                return context.localizeText('workorder_cannot_be_put_on_hold');
            case woTransfer:
                return context.localizeText('workorder_cannot_be_transferred');
            case woComplete:
                return context.localizeText('workorder_cannot_be_completed');
            default:
                return context.localizeText('status_cannot_be_updated');
        }
    }
    return context.localizeText('status_cannot_be_updated');
}
