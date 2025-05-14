import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditFloorPickerValue(context) {
    let floorPicker = libCom.getControlProxy(context, 'Floor');
    let value = floorPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
