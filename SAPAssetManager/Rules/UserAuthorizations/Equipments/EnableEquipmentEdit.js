import libCom from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Show/Hide Equipment edit button based on Persona and User Authorization
* @param {IClientAPI} context
*/
export default function EnableEquipmentEdit(context) {
    return !PersonaLibrary.isWCMOperator(context) && (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Edit') === 'Y');
}
