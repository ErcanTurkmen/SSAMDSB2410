import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for OrderItem - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function OrderItemNumberFieldMDI(context) {
	return HideZeroValues(context.binding.OrderItemNumber);
}
