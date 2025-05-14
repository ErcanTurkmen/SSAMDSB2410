/**
* Show/Hide Work Order edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import libMobileStatus from '../../MobileStatus/MobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import Logger from '../../Log/Logger';
import libPersona from '../../Persona/PersonaLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsPMWorkOrderEnabled from '../../UserFeatures/IsPMWorkOrderEnabled';
import IsCSServiceDataEnabled from '../../UserFeatures/IsCSServiceDataEnabled';
import SericeOrderEditEnabled from '../../ServiceOrders/CreateUpdate/SericeOrderEditEnabled';
import SericeRequestEditEnabled from '../../ServiceOrders/CreateUpdate/SericeRequestEditEnabled';
import libPhase from '../../PhaseModel/PhaseLibrary';

export default function EnableWorkOrderEdit(context, customBinding) {
    let binding = customBinding || context.binding;
    if (libPersona.isWCMOperator(context)) {
        return Promise.resolve(false);
    }
    if (binding && !binding['@odata.type'] && context.getActionBinding) {
        binding = context.getActionBinding();
    }
    if (libVal.evalIsEmpty(binding)) {
        return Promise.resolve(EnableOrLocal(context));
    }
    return libSuper.isBusinessObjectEditable(context).then(editable => {
        if (!editable) {
            return false; //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
        }
        switch (binding['@odata.type']) {
            case '#sap_mobile.S4ServiceOrder':
                return SericeOrderEditEnabled(context, binding);
                case '#sap_mobile.S4ServiceRequest':
                return SericeRequestEditEnabled(context, binding);
            case '#sap_mobile.MyWorkOrderHeader':
                return IsMyWorkOrderHeaderEditable(context, binding);
            case '#sap_mobile.MyWorkOrderOperation':
                return IsMyWorkOrderOperationEditable(context, binding);
            case '#sap_mobile.MyWorkOrderSubOperation':
                return IsMyWorkOrderSubOperationEditable(context, binding);
            case '#sap_mobile.WorkOrderHeader':
                return IsMyWorkOrderHeaderEditable(context, binding);
            default:
                return EnableOrLocal(context);
        }
    });
}

function EnableOrLocal(context) {
    return !!(libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y' || libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']));
}

function IsCompleted(context, mStatus) {
    return ['/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global']
        .map(globalDefPath => libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition(globalDefPath).getValue()))
        .includes(mStatus);  // is mobile status completed, reviewed or rejected
}

async function IsMyWorkOrderHeaderEditable(context, myWorkOrderHeader) {
    const enableFeature = IsPMWorkOrderEnabled(context) || IsCSServiceDataEnabled(context);
    if (!enableFeature) {
        return false;
    }

    // work order in Created state is not editable
    if (myWorkOrderHeader['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue() && libWO.isWorkOrderInCreatedState(context, myWorkOrderHeader)) {
        return false;
    }

    if (myWorkOrderHeader['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        const phaseEnabled = await libPhase.isPhaseModelActiveInDataObject(context, myWorkOrderHeader);
        if (phaseEnabled) {
            const isSupervisor = await libSuper.isUserSupervisor(context);
            if (!isSupervisor) { //Do not allow editing WO if user is not supervisor and order is phase enabled
                return false;
            }
        }
    }

    let mStatus;
    try {
        mStatus = libMobileStatus.getMobileStatus(myWorkOrderHeader, context);
    } catch (err) {
        Logger.error(`Failed to get mobile status: ${err}`);
    }
    return mStatus ? (EnableOrLocal(context) && !IsCompleted(context, mStatus)) : EnableOrLocal(context);
}

function IsMyWorkOrderSubOperationEditable(context, myWorkOrderSubOperation) {
    // sub operation related to work order in Created state is not editable
    if (libWO.isWorkOrderInCreatedState(context, myWorkOrderSubOperation)) {
        return Promise.resolve(false);
    }

    if (libMobileStatus.isSubOperationStatusChangeable(context)) {
        return Promise.resolve(EnableOrLocal(context) && !IsCompleted(context, libMobileStatus.getMobileStatus(myWorkOrderSubOperation, context)));
    }
    return libMobileStatus.isMobileStatusConfirmed(context, myWorkOrderSubOperation, myWorkOrderSubOperation.SubOperationNo)
        .then(isConfirmed => isConfirmed ? false : EnableOrLocal(context));
}

export function IsMyWorkOrderOperationEditable(context, myWorkOrderOperation) {
    // operation related to work order in Created state is not editable
    if (libWO.isWorkOrderInCreatedState(context, myWorkOrderOperation)) {
        return Promise.resolve(false);
    }

    return libMobileStatus.isMobileStatusComplete(context, 'MyWorkOrderHeaders', myWorkOrderOperation.OrderId, '', true).then(async isMobStatusComplete => {
        if (isMobStatusComplete) { //already complete so exit
            return Promise.resolve(false);
        }
        if (libMobileStatus.isOperationStatusChangeable(context)) {
            const isOperationCompleted = await libMobileStatus.isMobileStatusComplete(context, 'MyWorkOrderOperations', myWorkOrderOperation.OrderId, myWorkOrderOperation.OperationNo);
            return Promise.resolve(EnableOrLocal(context) && !isOperationCompleted);
        }
        return libMobileStatus.isMobileStatusConfirmed(context, myWorkOrderOperation)
            .then(isConfirmed => isConfirmed ? false : EnableOrLocal(context));
    });
}
