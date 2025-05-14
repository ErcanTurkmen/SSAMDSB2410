import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function MeasuringPointOperationCaption(pageClientAPI) {
    const isS4 = IsS4ServiceIntegrationEnabled(pageClientAPI);
    const operationLabel = isS4 ? '$(L,item)' : '$(L,operation)';
    let binding = pageClientAPI.binding;

    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.WOOperation_Nav;
    }
    if (binding.MeasuringPoint) {
        binding = binding.MeasuringPoint;
    }

    if (binding.OperationNo) { //PRT for operations
        let text = '';
        if (binding.OperationShortText && binding.OperationNo !== '*') {
            text = ' - ' + binding.OperationShortText;
        } 
        return operationLabel + text;
    }

    let data = pageClientAPI.getPageProxy().getClientData().MeasuringPointData; //Regular rows
    if (data && Object.prototype.hasOwnProperty.call(data,binding.Point)) {
        let row = data[binding.Point];
        if (row.OperationNo) {
            let text = '';
            if (row.OperationShortText && row.OperationNo.indexOf(',') === -1) { //If operation contains a comma then we have multiple operations, so ignore short text
                text = ' - ' + row.OperationShortText;
            }
            return operationLabel + text;
        }
    }
    return operationLabel;
}
