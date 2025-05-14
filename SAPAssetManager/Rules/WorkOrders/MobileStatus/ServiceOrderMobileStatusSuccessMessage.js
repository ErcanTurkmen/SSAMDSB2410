import CommonLibrary from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';

export default function ServiceOrderMobileStatusSuccessMessage(context) {
    let messageString = 'status_updated';

    LocationUpdate(context);
    context.dismissActivityIndicator();

    let clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        let status = clientData.ChangeStatus;

        const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        const TRANSFER = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        const REJECTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        const DISAPPROVE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
        const APPROVE = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue();
		
        switch (status) {
            case STARTED:
                messageString = 'service_order_started';
                break;
            case HOLD:
                messageString = 'service_order_on_hold';
                break;
            case TRANSFER:
                messageString = 'service_order_transferred';
                break;
            case COMPLETED:
                messageString = 'service_order_completed';
                break;
            case REVIEW:
                messageString = 'service_order_review';
                break;
            case APPROVE:
                messageString = 'service_order_approved';
                break;
            case REJECTED:
                messageString = 'service_order_rejected';
                break;
            case DISAPPROVE:
                messageString = 'service_order_disapproved';
                break;
            default:
                break;
        }
    }

    return context.localizeText(messageString);
}
