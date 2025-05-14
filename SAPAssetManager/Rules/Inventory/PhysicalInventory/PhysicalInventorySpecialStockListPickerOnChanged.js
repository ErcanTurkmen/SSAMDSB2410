import InventoryLibrary, { SpecialStock } from '../Common/Library/InventoryLibrary';

/** @param {IListPickerFormCellProxy} context  */
export default function PhysicalInventorySpecialStockListPickerOnChanged(context) {
    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const selectedSpecialStock = InventoryLibrary.GetListPickerSelection(context);
    /** @type {IListPickerFormCellProxy} */
    const vendorControl = formcellContainer.getControl('VendorListPicker');
    /** @type {IFormCellProxy} */
    const wbsControl = formcellContainer.getControl('WBSElementSimple');

    vendorControl.setVisible(PhysicalInventoryIsVendorVisible(selectedSpecialStock));
    wbsControl.setVisible(PhysicalInventoryIsWBSVisible(selectedSpecialStock));
}

export function PhysicalInventoryIsVendorVisible(selectedSpecialStock) {
    return selectedSpecialStock === SpecialStock.ConsignmentVendor;
}

export function PhysicalInventoryIsWBSVisible(selectedSpecialStock) {
    return selectedSpecialStock === SpecialStock.ProjectStock;
}
