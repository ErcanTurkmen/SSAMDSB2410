import InventoryLibrary from '../Common/Library/InventoryLibrary';
import { PhysicalInventoryIsVendorVisible } from './PhysicalInventorySpecialStockListPickerOnChanged';

/** @param {{getPageProxy(): IPageProxy & {binding: PhysicalInventoryDocHeader}} & IFormCellProxy} context  */
export default function PhysicalInventoryVendorIsVisible(context) {
    return PhysicalInventoryIsVendorVisible(GetPhysicalInventorySelectedSpecialStock(context));
}

export function GetPhysicalInventorySelectedSpecialStock(context) {
    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    if (!formcellContainer) {  // page init/loading time
        return '';
    }
    return InventoryLibrary.GetListPickerSelection(formcellContainer.getControl('SpecialStockIndicatorPicker')) || context.getPageProxy().binding.SpecialStock;
}
