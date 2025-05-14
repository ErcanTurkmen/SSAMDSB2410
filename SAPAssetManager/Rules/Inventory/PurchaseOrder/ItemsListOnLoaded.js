import libCom from '../../Common/Library/CommonLibrary';
export default function ItemsListOnLoaded(context) {
    let entitySet;
    let queryOpenItems = '$filter=';
    let queryConsumedItems = '$filter=';
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseRequisitionHeader') {
        // No need for filters
    } else if (type === 'PurchaseOrderHeader') {
        queryOpenItems += "((PurchaseOrderId eq '" + context.getPageProxy().binding.PurchaseOrderId + ") and ((FinalDeliveryFlag ne 'X') and (OpenQuantity gt 0)))";
        queryConsumedItems += "((PurchaseOrderId eq '" + context.getPageProxy().binding.PurchaseOrderId + "and ((FinalDeliveryFlag eq 'X' or (OpenQuantity eq 0)))";
        entitySet = 'PurchaseOrderItems';
    } else if (type === 'StockTransportOrderHeader') {
        entitySet = 'StockTransportOrderItems';
        let plant = libCom.getDefaultUserParam('USER_PARAM.WRK');
        let STOrderId = context.binding.StockTransportOrderId;
        queryOpenItems += "((StockTransportOrderId eq '" + STOrderId + "')";
        queryConsumedItems += "((StockTransportOrderId eq '" + STOrderId + "')";
        if (plant && plant === context.binding.SupplyingPlant) {
            queryConsumedItems += " and (((OrderQuantity eq IssuedQuantity) and (IssuedQuantity ne 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X'))))";
            queryOpenItems += " and (((OrderQuantity eq IssuedQuantity) and (IssuedQuantity eq 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X'))))";
        } else {
            queryConsumedItems += " and (((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity ne 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X'))))";
            queryOpenItems += " and (((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity eq 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X'))))";
        }
    }
    if (type === 'PurchaseOrderHeader' || type === 'StockTransportOrderHeader') {
        let openItemsCount = libCom.getEntitySetCount(context, entitySet, queryOpenItems);
        let consumedItemsCount = libCom.getEntitySetCount(context, entitySet, queryConsumedItems);
        let promises = [openItemsCount, consumedItemsCount];
        Promise.all(promises).then(() => {
            let filterCriteria = [];
            filterCriteria[0] = context._page.controls[0]._filterFeedbackCriteria[0];
            context._context.element._childControls[0].setFilters(filterCriteria, true);
        }).catch(error => console.log(`Default filter not set. Error: ${error}`));
    }
}
