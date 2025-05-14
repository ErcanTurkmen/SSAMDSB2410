import { SpecialStockToListpickerItem } from '../Item/ItemDetailsTarget';

/** @param {IClientAPI & {binding: PhysicalInventoryDocHeader | PhysicalInventoryDocItem}} context */
export default async function PhysicalInventoryDocHeaderGetRelatedSpecialStock(context) {
    const specialStock = GetSpecialStockForPhysicalInventoryDocHeaderOrItem(context.binding);
    return specialStock ? SpecialStockToListpickerItem(context, specialStock) : '';
}

/** @param {PhysicalInventoryDocHeader | PhysicalInventoryDocItem} headerOrItem */
export function GetSpecialStockForPhysicalInventoryDocHeaderOrItem(headerOrItem) {
    if (headerOrItem['@odata.type'] === '#sap_mobile.PhysicalInventoryDocHeader') {
        return headerOrItem.SpecialStock;
    } else if (headerOrItem['@odata.type'] === '#sap_mobile.PhysicalInventoryDocItem') {
        return headerOrItem.PhysicalInventoryDocHeader_Nav.SpecialStock;
    }
}
