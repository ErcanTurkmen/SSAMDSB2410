import libCom from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function ServiceOrderEquipment(context) {
    if (libCom.isDefined(context.binding.MyEquipment_Nav)) {
        return ValueIfExists(context.binding.MyEquipment_Nav.EquipDesc);
    }
    if (libCom.isDefined(context.binding.Equipment_Nav)) {
        return ValueIfExists(context.binding.Equipment_Nav.EquipDesc);
    }

    return ValueIfExists('');
}
