import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function WorkOrderMobileStatusSuccessMessage(context) {
    LocationUpdate(context);
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        const status = clientData.ChangeStatus;
        const woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        const woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        const woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const woReview = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        const woDisapprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
        const woApprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
        switch (status) {
            case woStarted:
                return context.localizeText('work_order_started');
            case woHold:
                return context.localizeText('work_order_on_hold');
            case woTransfer:
                return context.localizeText('work_order_transferred');
            case woComplete:
                return context.localizeText('work_order_completed');
            case woReview:
                return context.localizeText('workorder_review');
            case woApprove:
                return context.localizeText('workorder_approved');
            case woDisapprove:
                return context.localizeText('workorder_disapproved');
            default:
                return context.localizeText('status_updated');
        }
        // }
    }
    return context.localizeText('status_updated');
}
