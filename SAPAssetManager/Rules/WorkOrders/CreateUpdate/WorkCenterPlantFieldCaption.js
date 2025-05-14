import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function WorkCenterPlantFieldCaption(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) ?`${context.localizeText('work_center_plant')}*` : context.localizeText('work_center_plant');
}
