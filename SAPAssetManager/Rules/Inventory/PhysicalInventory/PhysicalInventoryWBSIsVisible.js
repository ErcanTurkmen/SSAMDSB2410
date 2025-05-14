import { PhysicalInventoryIsWBSVisible } from './PhysicalInventorySpecialStockListPickerOnChanged';
import { GetPhysicalInventorySelectedSpecialStock } from './PhysicalInventoryVendorIsVisible';

/** @param {{getPageProxy(): IPageProxy & {binding: PhysicalInventoryDocHeader}} & IFormCellProxy} context  */
export default function PhysicalInventoryWBSIsVisible(context) {
    return PhysicalInventoryIsWBSVisible(GetPhysicalInventorySelectedSpecialStock(context));
}
