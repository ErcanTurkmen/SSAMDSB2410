import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for PurchaseOrderItem - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function PurchaseOrderItemFieldMDI(context) {
	if (context.binding.PurchaseOrderItem_Nav) {
		return HideZeroValues(context.binding.PurchaseOrderItem_Nav.ItemNum);
	}
}

