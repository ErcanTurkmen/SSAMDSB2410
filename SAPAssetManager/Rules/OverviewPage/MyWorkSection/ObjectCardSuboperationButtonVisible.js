import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardSuboperationButtonVisible(context) {
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REJECTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());

    if (IsFSMCSSectionVisible(context) && !IsClassicLayoutEnabled(context)) {
        if (IsOperationLevelAssigmentType(context)) {
            let mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
            return !(mobileStatus === COMPLETE || mobileStatus === TRANSFER || mobileStatus === REJECTED);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            return false;
        } else {
            return false;
        }
    } 
    return false;
}
