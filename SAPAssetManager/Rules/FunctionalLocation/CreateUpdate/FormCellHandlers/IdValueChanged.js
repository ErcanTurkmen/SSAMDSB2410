import libCommon from '../../../Common/Library/CommonLibrary';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function IdValueChangedForFlocId(control) {
    const proxy = control.getPageProxy();
    let enteredValue = control.getValue();
    let mask = libCommon.getStateVariable(proxy, 'EditMask');
    let validated = proxy.getClientData().validated;

    if (mask) {
        if (libFLOC.validateId(enteredValue, mask)) {
            ResetValidationOnInput(control);
            proxy.getClientData().validated = false;
        } else if (!validated) {
            proxy.getClientData().validated = true;
            libCommon.setInlineControlError(control, control, control.localizeText('wrong_value', [mask]));
            control.applyValidation();
        }
    }
}
