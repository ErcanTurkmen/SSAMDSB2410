import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for OrderNumber - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function OrderNumberFieldMDI(context) {
	return HideZeroValues(context.binding.OrderNumber);
}
