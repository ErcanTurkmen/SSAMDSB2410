import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import libPersona from '../../Persona/PersonaLibrary';

export default function ObjectCardOrderButtonVisible(context) {
    if ((IsFSMCSSectionVisible(context) && !IsClassicLayoutEnabled(context) && IsOperationLevelAssigmentType(context)) || libPersona.isWCMOperator(context)) {
       return false;
    }

    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());

    if (IsOperationLevelAssigmentType(context)) {
        let mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        return !(mobileStatus === COMPLETE || mobileStatus === TRANSFER);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        return false;
    } else {
        return true;
    }
}
