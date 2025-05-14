import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
export default function CalculateNewOpenQuantity(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    const tempItem = libCom.getStateVariable(context, 'TempItem');

    const binding = context.binding.TempItem_OpenQuantity !== undefined && context.binding || tempItem;

    if (type === 'STO') {
        return Number(binding.TempItem_OpenQuantity); //Open is unused on client for STO
    }
    if (type === 'PO') {
        if ((binding.TempLine_MovementType === MovementTypes.t105) || (binding.TempLine_MovementType === MovementTypes.t109)
            || (binding.TempLine_MovementType === MovementTypes.t106) || (binding.TempLine_MovementType === MovementTypes.t110)) {
            return Number(binding.TempItem_OpenQuantity);
        } else if ((binding.TempLine_MovementType === MovementTypes.t102) || (binding.TempLine_MovementType === MovementTypes.t104)
            || (binding.TempLine_MovementType === MovementTypes.t108) || (binding.TempLine_MovementType === MovementTypes.t124)) {
            return Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
        }
    }
    //Subtract new quantity from previously open adding old quantity (if this was an edit)
    return Number(binding.TempItem_OpenQuantity) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);

}
