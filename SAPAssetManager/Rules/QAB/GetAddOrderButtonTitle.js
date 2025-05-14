import PersonaLibrary from '../Persona/PersonaLibrary';

export default function GetAddOrderButtonTitle(context) {
    let isFST = PersonaLibrary.isFieldServiceTechnician(context);
    let title = isFST ? context.localizeText('add_service_order') : context.localizeText('add_workorder');
    
    return title;
}
