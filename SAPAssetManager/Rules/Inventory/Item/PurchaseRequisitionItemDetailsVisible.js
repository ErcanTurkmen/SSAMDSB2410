
export default function PurchaseRequisitionItemDetailsVisible(context) {
    return context.getPageProxy().binding.item['@odata.type'].includes('PurchaseRequisitionItem');
}
