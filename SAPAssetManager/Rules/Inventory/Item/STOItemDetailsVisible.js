
export default function STOItemDetailsVisible(context) {
    /** @type {import('./ItemsData').ItemDetailsBinding}  */
    const binding = context.getPageProxy().binding;
    return binding.item['@odata.type'].includes('StockTransportOrderItem');
}
