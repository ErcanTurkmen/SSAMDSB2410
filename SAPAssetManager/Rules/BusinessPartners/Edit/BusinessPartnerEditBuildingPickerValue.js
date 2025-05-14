import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditBuildingPickerValue(context) {
    let buildingPicker = libCom.getControlProxy(context, 'Building');
    let value = buildingPicker?.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
