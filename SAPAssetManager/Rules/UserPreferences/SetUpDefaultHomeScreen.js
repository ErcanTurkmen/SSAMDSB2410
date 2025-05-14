import libPersona from '../Persona/PersonaLibrary';

/**
* Sets user preference to use new home screen layout as default after intial sync/app update
* @param {IClientAPI} clientAPI
*/
export default function SetUpDefaultHomeScreen(context) {
    libPersona.setUpUserDefaultHomeScreen(context);
}
