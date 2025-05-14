import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditPostalCodePickerValue(context) {
    let postalCodePicker = libCom.getControlProxy(context, 'ZipCode');
    let value = postalCodePicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
