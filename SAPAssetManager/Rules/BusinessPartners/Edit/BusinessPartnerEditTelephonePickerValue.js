import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditTelephonePickerValue(context) {
    let telephonePicker = libCom.getControlProxy(context, 'Phone');
    let value = telephonePicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
