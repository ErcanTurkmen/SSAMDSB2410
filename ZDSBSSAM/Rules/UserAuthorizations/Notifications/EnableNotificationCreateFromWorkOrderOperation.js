import EnableNotificationCreate from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreate';
import EnableWorkOrderEdit, { IsMyWorkOrderOperationEditable } from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsPhaseModelEnabled from '../../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import checkOperationNotificationExists from '../../WorkOrders/Operations/ZCheckOperationNotificationExists';


export default function EnableNotificationCreateFromWorkOrderOperation(clientAPI) {
     //DSB customisation - check if order is so13 and notification does not exists
     return checkOperationNotificationExists(clientAPI);
   /* if (IsPhaseModelEnabled(clientAPI) || !EnableNotificationCreate(clientAPI)) {
        return Promise.resolve(false);
    }
    return Promise.all([
        EnableWorkOrderEdit(clientAPI),
        IsWCMPersonaWithNonCompletedWorkOrderOperation(clientAPI, clientAPI.binding),
    ]).then(isEditEnabledArray => isEditEnabledArray.some(isEditEnabled => isEditEnabled === true));
    */
}

function IsWCMPersonaWithNonCompletedWorkOrderOperation(context, myWorkOrderOperation) {
    return libPersona.isWCMOperator(context) ? IsMyWorkOrderOperationEditable(context, myWorkOrderOperation) : Promise.resolve(false);
}
