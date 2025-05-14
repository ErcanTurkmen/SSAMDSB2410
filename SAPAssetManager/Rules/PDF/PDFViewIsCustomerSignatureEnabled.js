import CommonLibrary from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
/* 
Disable Customer signature if one already exists on the order/operation/item
*/

export default function PDFViewIsCustomerSignatureEnabled(context) {
    let binding = context.binding || CommonLibrary.getStateVariable(context, 'ServiceReportData');
    const operationOdataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();
    const serviceItemDataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeServiceItem.global').getValue();
    const isS4ServiceEnabled = IsS4ServiceIntegrationEnabled(context);
    let entity;
    let queryOptions;

    if (isS4ServiceEnabled) {
        entity = 'S4ServiceOrderDocuments';
        queryOptions = `$filter=ObjectID eq '${binding.ObjectID}'`;
        if (binding['@odata.type'] === serviceItemDataType) {
            queryOptions += ` and ItemNo eq '${binding.ItemNo}'`;
        } else {
            queryOptions += " and (ItemNo eq '' or ItemNo eq null)";
        }
    } else {
        entity = 'MyWorkOrderDocuments';
        queryOptions = `$filter=OrderId eq '${binding.OrderId}'`;
        if (binding['@odata.type'] === operationOdataType) {
            queryOptions += ` and OperationNo eq '${binding.OperationNo}'`;
        } else {
            queryOptions += " and (OperationNo eq '' or OperationNo eq null)";
        }
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], `${queryOptions}&$expand=Document`).then(attachments => {
        let customerSignatureIndex = -1;
        
        if (attachments.length > 0) {
            let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
            customerSignatureIndex = attachments.findIndex(attachment => attachment.Document && attachment.Document.FileName.startsWith(customerSignaturePrefix));
        }

        return customerSignatureIndex === -1;
        
    });
}
