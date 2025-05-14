import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function PriorityFieldCaption(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) ?`${context.localizeText('priority')}*` : context.localizeText('priority');
}
