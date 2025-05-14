import libCom from '../../Common/Library/CommonLibrary';

export default function RejectedStatusStyle(context) {

    let rejected = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let disapproved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    let approved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    let status;
    let binding = context.binding;

    if (binding) {
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' && binding.OrderMobileStatus_Nav) {
            status = context.binding.OrderMobileStatus_Nav.MobileStatus; 
        }
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' && binding.OperationMobileStatus_Nav) {
            status = context.binding.OperationMobileStatus_Nav.MobileStatus;   
        }
        if (status === rejected || status === disapproved) {
            return 'ResetRed';
        }
        if (status === approved) {
            return 'AcceptedGreen';
        }
    }
    return '';
}   
