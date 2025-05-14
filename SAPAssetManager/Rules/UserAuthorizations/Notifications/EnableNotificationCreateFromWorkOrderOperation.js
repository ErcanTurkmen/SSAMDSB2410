import EnableNotificationCreate from './EnableNotificationCreate';
import EnableWorkOrderEdit, { IsMyWorkOrderOperationEditable } from '../WorkOrders/EnableWorkOrderEdit';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import libPersona from '../../Persona/PersonaLibrary';

export default function EnableNotificationCreateFromWorkOrderOperation(clientAPI) {
    if (IsPhaseModelEnabled(clientAPI) || !EnableNotificationCreate(clientAPI)) {
        return Promise.resolve(false);
    }
    return Promise.all([
        EnableWorkOrderEdit(clientAPI),
        IsWCMPersonaWithNonCompletedWorkOrderOperation(clientAPI, clientAPI.binding),
    ]).then(isEditEnabledArray => isEditEnabledArray.some(isEditEnabled => isEditEnabled === true));
}

function IsWCMPersonaWithNonCompletedWorkOrderOperation(context, myWorkOrderOperation) {
    return libPersona.isWCMOperator(context) ? IsMyWorkOrderOperationEditable(context, myWorkOrderOperation) : Promise.resolve(false);
}
