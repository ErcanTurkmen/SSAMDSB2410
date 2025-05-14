import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditRoomNumberPickerValue(context) {
    let roomNumberPicker = libCom.getControlProxy(context, 'Room');
    let value = roomNumberPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
