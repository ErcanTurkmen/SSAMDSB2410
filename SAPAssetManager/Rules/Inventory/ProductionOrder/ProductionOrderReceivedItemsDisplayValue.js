import libCom from '../../Common/Library/CommonLibrary';
/**
* This function returns caption for Received PRD Items alongwith count
* @param {IClientAPI} clientAPI
*/
export default function ProductionOrderReceivedItemsDisplayValue(clientAPI) {
    let baseQuery = "OrderId eq '" + clientAPI.getPageProxy().binding.OrderId + "' and (DeliveryCompletedFlag eq 'X' or (not (OrderQuantity eq 0 or ReceivedQuantity eq 0 or OrderQuantity gt ReceivedQuantity)))";
    const queryOptions = '$filter=(' + baseQuery + ')';

    return libCom.getEntitySetCount(clientAPI, 'ProductionOrderItems', queryOptions).then(count => {
        return clientAPI.localizeText('received_items_x', [count]);
    });
}
