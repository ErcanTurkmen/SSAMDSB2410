import purchaseRequisitionDateCaption from '../PurchaseRequisition/PurchaseRequisitionDateCaption';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemBodyText(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    const purchaseReqType = 'PurchaseRequisitionItem';

    if (type === physicType) {
        if (item.EntryQuantity > 0 || item.ZeroCount === 'X') {
            return context.localizeText('counted');
        } else {
            return context.localizeText('pi_uncounted');
        }
    } else if (type === purchaseReqType) {
        return purchaseRequisitionDateCaption(context, item.RequisitionDate);
    }
}
