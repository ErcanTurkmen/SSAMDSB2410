
/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemSerialNumbersVisible(context) {
    const type = context.getPageProxy().binding.item['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    const purchaseReqType = 'PurchaseRequisitionItem';
    const item = context.getPageProxy().getClientData().item || context.getPageProxy().binding.item;

    if (type === purchaseReqType) {
        return false;
    }
    if (type === physicType) {
        return !item.ZeroCount && (item.EntryQuantity > 0);
    }

    return type !== 'ReservationItem';
}
