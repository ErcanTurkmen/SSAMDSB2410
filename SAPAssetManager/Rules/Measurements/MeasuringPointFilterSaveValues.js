
export default function MeasuringPointFilterSaveValues(context) {
	const name = context.getName();
	const value = context.getValue();

	const clientData = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData();

	if (clientData.FilterValues) {
		clientData.FilterValues[name] = value;
	} else {
		clientData.FilterValues = {[name] : value};
	}
}
