import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function SubOperationMobileStatusSuccessMessage(context) {
    LocationUpdate(context);
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
                    return context.localizeText('suboperation_started');
                case oprHold:
                    return context.localizeText('suboperation_on_hold');
                case oprTransfer:
                    return context.localizeText('suboperation_transferred');
                case oprComplete:
                    return context.localizeText('suboperation_completed');
                default:
                    return context.localizeText('status_updated');
            }
        }
        return context.localizeText('status_updated');
    }
}
