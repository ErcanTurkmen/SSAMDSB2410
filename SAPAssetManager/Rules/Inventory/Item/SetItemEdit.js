import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';
import SetMaterialDocumentGoodsReceipt from '../MaterialDocument/SetMaterialDocumentGoodsReceipt';
import SetPurchaseOrderGoodsReceipt from '../PurchaseOrder/SetPurchaseOrderGoodsReceipt';
import SetPhysicalInventoryCountHeaderExists from '../PhysicalInventory/SetPhysicalInventoryCountHeaderExists';
import SetGoodsReceiptOutboundDelivery from '../OutboundDelivery/SetGoodsReceiptOutboundDelivery';
import SetGoodsReceiptInboundDelivery from '../InboundDelivery/SetGoodsReceiptInboundDelivery';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function SetItemEdit(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    if (item) {
        context.setActionBinding(item);
    }  
    if (MaterialHeaderButtonVisible(context, true)) {
        return SetMaterialDocumentGoodsReceipt(context, item);
    } else if (item['@odata.type'].includes('PhysicalInventoryDocItem') || item['@odata.type'].includes('PhysicalInventoryDocHeader')) {
        return SetPhysicalInventoryCountHeaderExists(context);
    } else if (item['@odata.type'].includes('OutboundDeliveryItem') || item['@odata.type'].includes('OutboundDelivery')) {
        return SetGoodsReceiptOutboundDelivery(context);
    } else if (item['@odata.type'].includes('InboundDeliveryItem') || item['@odata.type'].includes('InboundDelivery')) {
        return SetGoodsReceiptInboundDelivery(context);
    } else {
        return SetPurchaseOrderGoodsReceipt(context, item);
    }
}
