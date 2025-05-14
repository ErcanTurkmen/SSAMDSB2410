import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';

export default function ObjectCardNotificationButtonVisible(context) {
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REJECTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let mobileStatus;
    if (IsOperationLevelAssigmentType(context)) {
        mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        return !(mobileStatus === COMPLETE || mobileStatus === TRANSFER || (IsFSMCSSectionVisible(context) && !IsClassicLayoutEnabled(context) && mobileStatus === REJECTED));
    } else if (IsSubOperationLevelAssigmentType(context)) {
        mobileStatus = context.binding.SubOpMobileStatus_Nav.MobileStatus;
        return !(mobileStatus === COMPLETE || mobileStatus === TRANSFER);
    } else {
        mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        if (mobileStatus === COMPLETE || mobileStatus === TRANSFER) {
            return false;
        }
    }
    return true;
}
