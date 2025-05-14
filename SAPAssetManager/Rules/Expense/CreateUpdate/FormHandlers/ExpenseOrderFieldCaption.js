import PersonaLibrary from '../../../Persona/PersonaLibrary';

export default function ExpenseOrderFieldCaption(context) {
    if (PersonaLibrary.isMaintenanceTechnician(context)) {
        return context.localizeText('workorder') + '*';
    } else {
        return context.localizeText('service_order') + '*';
    }
}  
