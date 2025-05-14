import isWindows from '../Common/IsWindows';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function InspectionCharacteristicsPersonalization(context) {
    return !isWindows(context) && ((PersonaLibrary.isFieldServiceTechnicianProInCSMode(context)) || PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context));
}
