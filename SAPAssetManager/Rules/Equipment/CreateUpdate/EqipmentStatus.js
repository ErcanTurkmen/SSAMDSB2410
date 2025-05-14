import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EqipmentStatus(context) {
    const superiorEquip = CommonLibrary.getStateVariable(context, 'createdEquipSuperior');
    return CommonLibrary.isDefined(superiorEquip) ? 'I0116' : 'I0099';
}
