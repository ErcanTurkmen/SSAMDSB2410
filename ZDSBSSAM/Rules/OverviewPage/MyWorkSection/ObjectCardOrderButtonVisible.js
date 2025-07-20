import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMCSSectionVisible from '../../../../SAPAssetManager/Rules/ServiceOrders/IsFSMCSSectionVisible';
import IsClassicLayoutEnabled from '../../../../SAPAssetManager/Rules/Common/IsClassicLayoutEnabled';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import EnableWorkOrderCreate from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function ObjectCardOrderButtonVisible(context) {
    if (EnableWorkOrderCreate(context)) {        //DSB customization to remove add work order from operation's object card in work order detail page
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
    else {
        return false;
    }
}
