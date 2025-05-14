import IsPurchaseRequisitionEnabled from '../IsPurchaseRequisitionEnabled';
import PersonaLibrary from '../../../Persona/PersonaLibrary';

export default function IsPurchaseRequisitionVisible(context) {
    return IsPurchaseRequisitionEnabled(context) && isAllowedPersona(context);
}

function isAllowedPersona(context) {
    return PersonaLibrary.isFieldServiceTechnicianInCSMode(context) || PersonaLibrary.isMaintenanceTechnician(context);
}
