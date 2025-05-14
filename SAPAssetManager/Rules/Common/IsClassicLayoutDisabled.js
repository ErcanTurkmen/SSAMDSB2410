import libPersona from '../Persona/PersonaLibrary';

export default function IsClassicLayoutDisabled(context) {
    return !libPersona.isClassicHomeScreenEnabled(context);
}
