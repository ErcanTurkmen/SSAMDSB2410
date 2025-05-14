import libCommon from '../../Common/Library/CommonLibrary';
export default function SubOperationMobileStatusFailureMessage(context) {
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData) {
        if (clientData.ChangeStatus) {
            const status = clientData.ChangeStatus;
            const oprStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const oprHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            const oprTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
            const oprComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

            switch (status) {
                case oprStarted:
                    return context.localizeText('subperation_cannot_be_started');
                case oprHold:
                    return context.localizeText('suboperation_cannot_be_put_on_hold');
                case oprTransfer:
                    return context.localizeText('suboperation_cannot_be_transferred');
                case oprComplete:
                    return context.localizeText('suboperation_cannot_be_completed');
                default:
                    return context.localizeText('status_cannot_be_updated');
            }
        }
        return context.localizeText('status_cannot_be_updated');
    }
}
