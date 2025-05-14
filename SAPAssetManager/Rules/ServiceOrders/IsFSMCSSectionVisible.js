import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsFSMCSSectionVisible(context) {
    return PersonaLibrary.isFieldServiceTechnicianInCSMode(context);
}
