import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditFaxExtPickerValue(context) {
    let faxExtPicker = libCom.getControlProxy(context, 'FaxExtension');
    let value = faxExtPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
