import libPersona, { LayoutStyleValues } from '../Persona/PersonaLibrary';

/**
* Gets user preference for new home screen layout switch
* @param {IClientAPI} clientAPI
*/
export default function LayoutStyleValue(context) {
    return libPersona.getLayoutStylePreference(context) || LayoutStyleValues.New;
}
