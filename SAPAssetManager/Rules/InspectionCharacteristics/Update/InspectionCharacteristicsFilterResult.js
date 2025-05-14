/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsFilterResult(context) {
    let filters = [
		context.evaluateTargetPath('#Page:InspectionCharacteristicsFDCFilter/#Control:FilterSeg/#FilterValue'),
		context.evaluateTargetPath('#Page:InspectionCharacteristicsFDCFilter/#Control:Operations/#FilterValue'),
		context.evaluateTargetPath('#Page:InspectionCharacteristicsFDCFilter/#Control:FuncLoc/#FilterValue'),
		context.evaluateTargetPath('#Page:InspectionCharacteristicsFDCFilter/#Control:Equipment/#FilterValue'),
	];

	return filters;
}
