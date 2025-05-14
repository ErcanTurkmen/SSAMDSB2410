import PersonaLibrary from '../Persona/PersonaLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';

export default function EnableTimeRecords(context) {
    return PersonaLibrary.isFieldServiceTechnicianInCSMode(context) && ConfirmationsIsEnabled(context);
}
