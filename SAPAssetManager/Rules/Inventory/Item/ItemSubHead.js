import { MovementTypes } from '../Common/Library/InventoryLibrary';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemSubHead(context) {
    const type = context.binding.item['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const physicType = 'PhysicalInventoryDocItem';
    const productionItemType = 'ProductionOrderItem';
    const productionCompType = 'ProductionOrderComponent';
    const reservationMT = [MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281];
    const purchaseOrderMT = [MovementTypes.t101, MovementTypes.t103, MovementTypes.t105, MovementTypes.t107, MovementTypes.t109];

    if (type === 'ReservationItem') {
        return context.localizeText('reservation') + ' - ' + item.ReservationNum;
    } else if (type === 'PurchaseOrderItem') {
        return context.localizeText('purchase_order') + ' - ' + item.PurchaseOrderId;
    } else if (type === 'PurchaseRequisitionItem') {
        return `${item.PurchaseReqItemNo} - ${item.Plant}/${item.StorageLocation}`;
    } else if (type === 'StockTransportOrderItem') {
        return context.localizeText('sto') + ' - ' + item.StockTransportOrderId;
    } else if (type === 'OutboundDeliveryItem') {
        return context.localizeText('outbound_delivery') + ' - ' + item.DeliveryNum;
    } else if (type === 'InboundDeliveryItem') {
        return context.localizeText('ibd_detail_title') + ' - ' + item.DeliveryNum;
    } else if (type === physicType) {
        return item.PhysInvDoc + '/' + item.FiscalYear;
    } else if (type === productionItemType) {
        return context.localizeText('production_order_label') + ' - ' + item.OrderId;
    } else if (type === productionCompType) {
        return context.localizeText('production_order_label') + ' - ' + item.OrderId;
    }

    const isPurchase = checkIsPurchase(item, purchaseOrderMT);

    if (type === 'MaterialDocItem') {
        if (isPurchase) { 
            return item.PurchaseOrderNumber + '/' + item.PurchaseOrderItem;
        } else if (reservationMT.includes(item.MovementType) && Number(item.ReservationNumber)) {
            return item.ReservationNumber + '/' + item.ReservationItemNumber;
        } else {
            return item.MaterialDocNumber + '/' + item.MatDocItem;
        }
    }
}

function checkIsPurchase(item, purchaseOrderMT) {
    return item.MovementType === '351' && item.PurchaseOrderNumber || purchaseOrderMT.includes(item.MovementType) && item.PurchaseOrderNumber;
}
