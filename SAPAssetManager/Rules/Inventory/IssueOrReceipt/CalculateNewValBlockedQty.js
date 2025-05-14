import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function CalculateNewValBlockedQty(context) {
    const tempItem = libCom.getStateVariable(context, 'TempItem');
    let binding;
    if (context.binding.TempItem_OpenQuantity !== undefined) {
        binding = context.binding;
    } else {
        binding = tempItem;
    }
    let openQtyValBlocked;
    if (!ValidationLibrary.evalIsEmpty(binding.OpenQtyValBlocked)) {
        openQtyValBlocked = binding.OpenQtyValBlocked;
    } else if (!ValidationLibrary.evalIsEmpty(binding.PurchaseOrderItem_Nav) && !ValidationLibrary.evalIsEmpty(binding.PurchaseOrderItem_Nav.OpenQtyValBlocked)) {
        openQtyValBlocked = binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
    } else if (binding.TempItem_ItemReadLink) {
        const purchaseOrderItem = await context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            binding.TempItem_ItemReadLink,
            [],
            '',
        ).then((results) => results.getItem(0));
        openQtyValBlocked = purchaseOrderItem.OpenQtyValBlocked;
    } else {
        openQtyValBlocked = 0;
    }
    if (binding.TempLine_MovementType === MovementTypes.t107) {
        return Number(openQtyValBlocked) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t108) {
        return Number(openQtyValBlocked) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t109) {
        return Number(openQtyValBlocked) - Number(binding.TempLine_QuantityInBaseUOM) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t110) {
        return Number(openQtyValBlocked) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else {
        return Number(openQtyValBlocked);
    }
}
