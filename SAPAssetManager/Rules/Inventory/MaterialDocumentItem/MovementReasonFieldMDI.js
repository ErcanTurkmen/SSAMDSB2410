import { HideZeroValues } from './MovementTypeFieldMDI';

/**
 * Hide zero values for MovementReason - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function MovementReasonFieldMDI(context) {
	return HideZeroValues(context.binding.MovementReason);
}

