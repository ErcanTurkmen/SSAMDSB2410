
export default function POItemDetailsVisible(context) {
    /** @type {import('./ItemsData').ItemDetailsBinding}  */
    const binding = context.getPageProxy().binding;
    return binding.item['@odata.type'].includes('PurchaseOrderItem');
}
