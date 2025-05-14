import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditFaxPickerValue(context) {
    let faxPicker = libCom.getControlProxy(context, 'Fax');
    let value = faxPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
