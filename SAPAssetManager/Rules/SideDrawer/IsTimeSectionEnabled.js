import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsTimeSectionEnabled(context) {
    // Check if either the time sheet or labor time is enabled AND persona is not FST or is FST in CS mode
    return (!PersonaLibrary.isFieldServiceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context)) && (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context));
}
