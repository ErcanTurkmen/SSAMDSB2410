import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditEmailPickerValue(context) {
    let emailPicker = libCom.getControlProxy(context, 'Email');
    let value = emailPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
