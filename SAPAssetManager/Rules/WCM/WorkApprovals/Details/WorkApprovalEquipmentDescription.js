import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WorkApprovalEquipmentDescription(context) {
    const equipId = context.binding.Equipment;
    if (equipId) {
        return CommonLibrary.getEntityProperty(context, `MyEquipments('${equipId}')`, 'EquipDesc').then(EquipDesc => {
            return EquipDesc;
        });
    }

    return '-';
}
