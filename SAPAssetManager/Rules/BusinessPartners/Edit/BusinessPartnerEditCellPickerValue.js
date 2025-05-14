import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditCellPickerValue(context) {
    let cellPicker = libCom.getControlProxy(context, 'Mobile');
    let value = cellPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
