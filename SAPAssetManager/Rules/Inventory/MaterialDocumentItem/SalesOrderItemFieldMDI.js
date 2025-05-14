import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for SalesOrderNumber - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function SalesOrderItemFieldMDI(context) {
	return HideZeroValues(context.binding.SalesOrderItem);
}

