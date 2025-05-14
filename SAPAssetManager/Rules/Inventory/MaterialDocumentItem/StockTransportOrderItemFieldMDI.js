import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for StockTransportOrderItem - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function StockTransportOrderItemFieldMDI(context) {
	if (context.binding.StockTransportOrderItem_Nav) {
		return HideZeroValues(context.binding.StockTransportOrderItem_Nav.ItemNum);
	}
}
