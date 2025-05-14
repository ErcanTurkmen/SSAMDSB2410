import libCom from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function OnloadUserSettings(context) {
    let switchPersonaLstPkrControl;
    const dict = libCom.getControlDictionaryFromPage(context);

    if (dict) {
        if (dict.SwitchPersonaLstPkr) {
            switchPersonaLstPkrControl = dict.SwitchPersonaLstPkr;

            const actualPersona = libPersona.getActivePersona(context);
            switchPersonaLstPkrControl.setValue(actualPersona);
            if (libVal.evalIsEmpty(actualPersona)) {
                switchPersonaLstPkrControl.setEditable(false);
            }

            const length = libCom.getStateVariable(context, 'UserPersonas').length;

            const editable = (length > 1);
            switchPersonaLstPkrControl.setEditable(editable);

            // save current persona in client data
            libCom.setStateVariable(
                context,
                'currentPersona',
                actualPersona,
                'UserProfileSettings',
            );
        }
        // store original user selection for location tracking
        if (dict.LocationTrackingSwitch) {
            libCom.setStateVariable(context, 'LocationTrackingSwitch', dict.LocationTrackingSwitch.getValue());
        }
    }
}
