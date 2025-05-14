import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditCityPickerValue(context) {
    let cityPicker = libCom.getControlProxy(context, 'City');
    let value = cityPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
