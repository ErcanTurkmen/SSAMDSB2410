import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function MeasuringPointsEDTFilterResult(context) {
	let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters || {};

	filters.active = {};

	let statuses = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:FilterSeg/#Value');
	if (statuses && statuses.length) {
		filters.active.statuses = statuses.map(item => item.ReturnValue);
	}

	let floc = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:FuncLoc/#Value');
	if (floc && floc.length) {
		filters.active.floc = floc.map(item => item.ReturnValue);
	}

	let equipment = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:Equipment/#Value');
	if (equipment && equipment.length) {
		filters.active.equipment = equipment.map(item => item.ReturnValue);
	}

	if (IsS4ServiceIntegrationEnabled(context)) {
		let s4Items = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:S4Items/#Value');
		if (s4Items && s4Items.length) {
			filters.active.operations = s4Items.map(item => item.ReturnValue);
		}
	} else {
		let operations = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:Operations/#Value');
		if (operations && operations.length) {
			filters.active.operations = operations.map(item => item.ReturnValue);
		}
	}

	let isPRT = context.evaluateTargetPath('#Page:MeasuringPointsFiltersEDT/#Control:FilterPRT/#Value');
	filters.active.prt = isPRT;

	context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters = filters;

	return [];
}
