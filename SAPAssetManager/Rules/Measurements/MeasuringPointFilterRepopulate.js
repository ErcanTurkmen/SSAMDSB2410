/**
* Repopulates controls on filter page given previous page's ClientData.FilterValues object
* @param {IClientAPI} context
*/
export default function MeasuringPointFilterRepopulate(context) {
	const filterValues = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().FilterValues;

	if (filterValues) {
		for (const control of Object.keys(filterValues)) {
			if (context.getControls()[0].getControl(control)._control.getType() === 'Control.Type.FormCell.ListPicker') { // List pickers need to be handled differently from other controls
				context.getControls()[0].getControl(control).setValue(filterValues[control].map(v => v.ReturnValue).join());
			} else {
				context.getControls()[0].getControl(control).setValue(filterValues[control]);
			}
		}
	}
}
