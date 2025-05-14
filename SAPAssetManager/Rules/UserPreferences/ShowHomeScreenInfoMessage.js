import libPersona from '../Persona/PersonaLibrary';

/**
* Executes message action with info that home screen layout is being used by default after intial sync/app update
* @param {IClientAPI} clientAPI
*/
export default function ShowHomeScreenInfoMessage(context) {
    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/HomeScreenInfoMessage.action');
    }
}
