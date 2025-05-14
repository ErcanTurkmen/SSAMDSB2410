import libPersona from '../Persona/PersonaLibrary';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';

/**
* Checks if classic MT home screen is visible
* @param {IClientAPI} clientAPI
*/
export default function MTClassicHomeScreenVisible(context) {
    return EnableMaintenanceTechnician(context) && libPersona.isClassicHomeScreenEnabled(context);
}
