/**
* Getting document items entity set name according document header value
* @param {IClientAPI} clientAPI
*/
export default function GetPurchaseOrderItemsEntitySet(context) {
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'StockTransportOrderHeader') {
        return 'StockTransportOrderItems';
    } else if (type === 'ReservationHeader') {
        return 'ReservationItems';
    } else if (type === 'ProductionOrderHeader') {
        return 'ProductionOrderItems';
    } else if (type === 'PurchaseRequisitionHeader') {
        return 'PurchaseRequisitionItems';
    } else 
        return 'PurchaseOrderItems';
}
