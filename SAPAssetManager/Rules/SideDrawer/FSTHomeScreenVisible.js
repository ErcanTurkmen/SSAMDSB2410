import libPersona from '../Persona/PersonaLibrary';
import EnableFieldServiceTechnician from './EnableFieldServiceTechnician';

/**
* Checks if new FST home screen is visible
* @param {IClientAPI} clientAPI
*/
export default function FSTHomeScreenVisible(context) {
    return EnableFieldServiceTechnician(context) && !libPersona.isClassicHomeScreenEnabled(context);
}
