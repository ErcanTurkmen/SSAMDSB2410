/**
* Show/Hide Work Order create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import IsPMWorkOrderEnabled from '../../UserFeatures/IsPMWorkOrderEnabled';
import IsCSServiceDataEnabled from '../../UserFeatures/IsCSServiceDataEnabled';

export default function EnableWorkOrderCreate(context) {
    let auth = (IsPMWorkOrderEnabled(context) || IsCSServiceDataEnabled(context)) && isUserAuthorizedToCreateWO(context);

    if (libPersona.isWCMOperator(context)) {
        return false;
    }
    return auth;
}

/**
 * 
 * @param {*} context 
 * @returns WO Create authorization
 */
export function isUserAuthorizedToCreateWO(context) {
    return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Create') === 'Y';
}
