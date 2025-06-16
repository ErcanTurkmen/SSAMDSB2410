import libForm from '../../../SAPAssetManager/Rules/Common/Library/FormatLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';

// added to show eq and eq desc in single field
export default function WorkOrderListViewEquipment(context) {
    let binding = context.binding;
    if (binding.Equipment) {
        return libForm.getFormattedKeyDescriptionPair(context, binding.Equipment.EquipId, binding.Equipment.EquipDesc);
    } else {
        return '';
    }
}

