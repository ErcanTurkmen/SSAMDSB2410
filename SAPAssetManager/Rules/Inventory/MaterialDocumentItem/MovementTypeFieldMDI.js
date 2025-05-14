import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Hide zero values for MovementType - display '-' instead of 0's
 * @param {IClientAPI} context 
 * @returns 
 */
export default function MovementTypeFieldMDI(context) {
	return HideZeroValues(context.binding.MovementType);
}

/**
 * hide zero values for provided parameter - display '-' instead of 0's
 * @param {string} value 
 * @returns 
 */
export function HideZeroValues(value) {
	return libVal.evalIsNumeric(value) && parseInt(value, 10) === 0 ? '-' : value;
}

