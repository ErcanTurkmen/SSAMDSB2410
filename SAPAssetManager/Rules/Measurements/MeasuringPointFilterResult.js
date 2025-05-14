/**
* Filter Result for Measuring Point FDC Page
* @param {IClientAPI} context
*/
export default function MeasuringPointFilterResult(context) {
	let filters = [
		context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:FilterSeg/#FilterValue'),
		context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:Operations/#FilterValue'),
		context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:S4Items/#FilterValue'),
		context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:FuncLoc/#FilterValue'),
		context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:Equipment/#FilterValue'),
	];

	if (context.evaluateTargetPath('#Page:MeasuringPointFilterPage/#Control:FilterPRT/#Value') === true) {
		filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FilterPRT', context.localizeText('show_only_PRT'), ['true'], false));
	}

	return filters;
}
