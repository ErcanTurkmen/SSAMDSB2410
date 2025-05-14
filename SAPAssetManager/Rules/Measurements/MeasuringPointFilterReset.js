/**
* Resets Measuring Point FDC Filter
* @param {IClientAPI} context
*/
export default function MeasuringPointFilterReset(context) {
	const filterValues = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().FilterValues;

	if (filterValues) {
		for (const control of Object.keys(filterValues)) {
			context.getPageProxy().getControls()[0].getControl(control).setValue('');
		}
		// Clear out FilterValues
		context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().FilterValues = {};
	}
}
