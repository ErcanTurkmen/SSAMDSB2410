import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsS4SidePanelDisabled(context) {
    return PersonaLibrary.isFieldServiceTechnicianInCSMode(context);
}
