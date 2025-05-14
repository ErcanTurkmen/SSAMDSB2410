import {SpecialStock } from '../Common/Library/InventoryLibrary';
/**
 * @param {IListPickerFormCellProxy} context
*/
export default function VendorListPickerIsVisible(context) {
    // when loading AdHoc page, the order of initalizing controllers is unknown.
    // it is possible that the formcellcontainer or SSI picker has not been initialized.
    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    if (formcellContainer) {
        const specialStockIndicatorPicker = formcellContainer.getControl('SpecialStockIndicatorPicker');
        // if ssi is visible and is either SpecialStock.ConsignmentVendor or 
        // selectedSpecialStock === SpecialStock.PipelineStock then set VendorListPicker to visible
        if (specialStockIndicatorPicker && specialStockIndicatorPicker.getVisible() ) {
            const ssi = specialStockIndicatorPicker.getValue();
            return ssi === SpecialStock.ConsignmentVendor || ssi === SpecialStock.PipelineStock;
        } 
    } else {
        return false;
    }
}
