import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EqipmentLocalID(context) {
    return CommonLibrary.getStateVariable(context, 'createdEquipID');
}
