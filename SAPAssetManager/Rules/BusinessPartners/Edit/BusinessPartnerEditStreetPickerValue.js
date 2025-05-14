import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditStreetPickerValue(context) {
    let streetPicker = libCom.getControlProxy(context, 'Street');
    let value = streetPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
