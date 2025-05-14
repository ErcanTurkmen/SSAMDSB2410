import GetPOItemState from '../PurchaseOrder/GetPOItemState';
import GetInboundOrOutboundItemState from '../InboundOrOutbound/GetInboundOrOutboundItemState';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemTags(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);
    const reservationMT = [MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281];
    const purchaseOrderMT = [MovementTypes.t101, MovementTypes.t103, MovementTypes.t105, MovementTypes.t107, MovementTypes.t109];
    const stockTransferMT = [MovementTypes.t301, MovementTypes.t303, MovementTypes.t305, MovementTypes.t311, MovementTypes.t313, MovementTypes.t315];
    const physicType = 'PhysicalInventoryDocItem';
    const purchaseReqType = 'PurchaseRequisitionItem';

    if (type === 'MaterialDocItem') {
        return getTags(item, context, purchaseOrderMT, reservationMT, stockTransferMT);
    } else if (type.includes('DeliveryItem')) {
        return [GetInboundOrOutboundItemState(context, item)];
    } else if (type === physicType) {
        return [];
    } else if (type === purchaseReqType && item.DocType) {
        return [context.localizeText('open'), item.DocType];
    }
    return [GetPOItemState(context, item)];
}

function getTags(item, context, purchaseOrderMT, reservationMT, stockTransferMT) {
    const tags = [item.MovementType];
    if (purchaseOrderMT.includes(item.MovementType) && item.PurchaseOrderNumber) {
        tags.push(context.localizeText('purchase_order'));
    } else if (item.MovementType === MovementTypes.t351 && item.PurchaseOrderNumber) {
        tags.push(context.localizeText('sto'));
    } else if (reservationMT.includes(item.MovementType)) {
        if (item.ReservationNumber) tags.push(context.localizeText('reservation'));
        else tags.push(context.localizeText('goods_issue_other'));
    } else if (stockTransferMT.includes(item.MovementType)) {
        tags.push(context.localizeText('stock_transfer'));
    } else if ([MovementTypes.t501,MovementTypes.t502].includes(item.MovementType)) {
        tags.push(context.localizeText('goods_recipient_other'));
    }
    return tags;
}
