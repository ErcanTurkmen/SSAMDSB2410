import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function OperationMobileStatusSuccessMessage(context) {
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
            const oprReview = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            const oprDisapprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
            const oprApprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
            switch (status) {
                case oprStarted:
                    return context.localizeText('operation_started');
                case oprHold:
                    return context.localizeText('operation_on_hold');
                case oprTransfer:
                    return context.localizeText('operation_transferred');
                case oprComplete:
                    return context.localizeText('operation_completed');
                case oprReview:
                    return context.localizeText('operation_review');
                case oprApprove:
                    return context.localizeText('operation_approved');
                case oprDisapprove:
                    return context.localizeText('operation_disapproved');
                default:
                    return context.localizeText('status_updated');
            }
        }
        return context.localizeText('status_updated');
    }
}
