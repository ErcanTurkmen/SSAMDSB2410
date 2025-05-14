import libPersona from '../Persona/PersonaLibrary';
import EnableFieldServiceTechnician from './EnableFieldServiceTechnician';

/**
* Checks if classic FST home screen is visible
* @param {IClientAPI} clientAPI
*/
export default function FSTClassicHomeScreenVisible(context) {
    return EnableFieldServiceTechnician(context) && libPersona.isClassicHomeScreenEnabled(context);
}
