import libCom from '../../Common/Library/CommonLibrary';

export default function RejectReasonIsVisible(context) {
    
    let businessObject = context.getPageProxy().binding;
    let disapprove = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        if (businessObject.OrderMobileStatus_Nav) {
            if (businessObject.OrderMobileStatus_Nav.MobileStatus === disapprove) {
                return true;
            }
        }
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (businessObject.OperationMobileStatus_Nav) {
            if (businessObject.OperationMobileStatus_Nav.MobileStatus === disapprove) {
                return true;
            }
        }
    }
    return false;
}
