import PersonaLibrary from '../Persona/PersonaLibrary';

export default function PartObjectCardCollectionIsVisible(context) {
    return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context);
}
