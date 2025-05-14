
/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemFootnote(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';

    if (type === physicType) {
        return item.Plant + '/' + item.StorLocation;
    }
}
