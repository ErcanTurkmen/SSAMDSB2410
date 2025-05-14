import PersonaLibrary from '../../../Persona/PersonaLibrary';

/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function WorkCenterFieldCaption(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) ?`${context.localizeText('work_center')}*` : context.localizeText('work_center');
}
