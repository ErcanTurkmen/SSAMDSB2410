import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function DescriptionFieldCaption(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) ?`${context.localizeText('description')}*` : context.localizeText('description');
}
