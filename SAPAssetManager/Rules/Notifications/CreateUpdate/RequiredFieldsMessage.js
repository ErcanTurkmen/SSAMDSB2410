import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Add required fields message for FSM CS
* @param {IClientAPI} context
*/
export default function RequiredFieldsMessage(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) ? context.localizeText('indicates_required_fields') : '';
}
