import { EquipmentLibrary as equipmentLib } from '../../Rules/Equipment/EquipmentLibrary';
import FormatLibrary from '../Common/Library/FormatLibrary';
import { IsBindingObjectOnline } from '../WorkOrders/IsBindingObjectOnline';

export default async function OperationHeaderEquipmentDescription(context) {
    let binding = context.binding;
    if (binding.OperationEquipment) {
        if (IsBindingObjectOnline(context)) {
            const filter = `$filter=EquipId eq '${binding.OperationEquipment}'`;
            const equipment = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Equipments', ['EquipId', 'EquipDesc'], filter).then(result => result.length ? result.getItem(0) : null);
 
            if (equipment) {
                return FormatLibrary.getFormattedKeyDescriptionPair(context, equipment.EquipId, equipment.EquipDesc);
            }

            return Promise.resolve('');
        }
        return equipmentLib.getEquipmentDescriptionWithIdFormat(context, binding.OperationEquipment);
    }
    
    return Promise.resolve('');
}
