import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function CalculateNewBlockedQuantity(context) {
    const tempItem = libCom.getStateVariable(context, 'TempItem');
    let binding;
    if (context.binding.TempItem_OpenQuantity !== undefined) {
        binding = context.binding;
    } else {
        binding = tempItem;
    }
    let openQuantityBlocked;
    if (!ValidationLibrary.evalIsEmpty(binding.OpenQuantityBlocked)) {
        openQuantityBlocked = binding.OpenQuantityBlocked;
    } else if (!ValidationLibrary.evalIsEmpty(binding.PurchaseOrderItem_Nav) && !ValidationLibrary.evalIsEmpty(binding.PurchaseOrderItem_Nav.OpenQuantityBlocked)) {
        openQuantityBlocked = binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
    } else if (binding.TempItem_ItemReadLink) {
        const purchaseOrderItem = await context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            binding.TempItem_ItemReadLink,
            [],
            '',
        ).then((results) => results.getItem(0));
        openQuantityBlocked = purchaseOrderItem.OpenQuantityBlocked;
    } else {
        openQuantityBlocked = 0;
    }

    if (binding.TempLine_MovementType === MovementTypes.t103) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t104) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t105) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t106) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t124) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t125) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else {
        return Number(openQuantityBlocked);
    }
}
