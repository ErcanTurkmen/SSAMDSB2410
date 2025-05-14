export default function MeasuringPoint(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        return binding.PRTPoint.Point;
    }
    if (Object.prototype.hasOwnProperty.call(binding,'Point')) {
        return binding.Point;
    } else {
        return binding.MeasuringPoint.Point;
    }
}
