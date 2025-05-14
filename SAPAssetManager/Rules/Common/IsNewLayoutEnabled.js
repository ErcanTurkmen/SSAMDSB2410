import libPersona from '../Persona/PersonaLibrary';

export default function IsNewLayoutEnabled(context) {
    return libPersona.isNewHomeScreenEnabled(context);
}
