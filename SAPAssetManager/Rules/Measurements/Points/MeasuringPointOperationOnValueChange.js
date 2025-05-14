import { FDCSectionHelper } from '../../FDC/DynamicPageGenerator';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Change the client data on value change after finding the object number for the operation
* @param {IClientAPI} clientAPI
*/
export default function MeasuringPointOperationOnValueChange(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let isS4 = IsS4ServiceIntegrationEnabled(clientAPI);
    let selectedOperation = isS4 ? clientAPI.getValue()[0].ReturnValue : clientAPI.binding.Operations.find(operation => operation.OperationNo === clientAPI.getValue()[0].ReturnValue); // find the operation that is selected from the list of operations
    if (selectedOperation) {
        let sectionHelper = new FDCSectionHelper(clientAPI);
        let section = sectionHelper.findSection(clientAPI);
        if (section && section.binding) {
            let clientData = pageProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData();
            clientData.MeasuringPointData[section.binding.Point].Operation = isS4 ? selectedOperation : selectedOperation.ObjectNumber;
        }
    }
}
