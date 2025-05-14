import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditTelExtPickerValue(context) {
    let extensionPicker = libCom.getControlProxy(context, 'Extension');
    let value = extensionPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
