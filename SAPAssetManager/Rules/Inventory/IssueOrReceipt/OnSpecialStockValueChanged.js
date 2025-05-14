import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import libInv, { MovementTypes, SpecialStock } from '../Common/Library/InventoryLibrary';


/** @param {IListPickerFormCellProxy} context */
export default function OnSpecialStockValueChanged(context, ssiListPicker) {
    const selectedSpecialStock = ssiListPicker || libInv.GetListPickerSelection(context);
    ResetValidationOnInput(context);

    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const movementTypeControl = formcellContainer.getControl('MovementTypePicker');
    const movementType = libInv.GetListPickerSelection(movementTypeControl);
    const vendorControl = formcellContainer.getControl('VendorListPicker');
    const salesOrderControl = formcellContainer.getControl('SalesOrderSimple');
    const salesItemControl = formcellContainer.getControl('SalesOrderItemSimple');
    const storageLocationControl = formcellContainer.getControl('StorageLocationPicker');
    const wbsControl = formcellContainer.getControl('WBSElementSimple');
    const costCenterControl = formcellContainer.getControl('CostCenterSimple');

    // Hide all 4 SSI dependent fields, then show according to current movement type and SSI values
    vendorControl.setVisible(false);
    salesOrderControl.setVisible(false);
    salesItemControl.setVisible(false);
    wbsControl.setVisible(false);
    // MovementTypes.t231 - Sales Order and Sales Order Item are ALWAYS visible regardless of SSI
    // MovementTypes.t221, MovementTypes.t222 - WBS is ALWAYS visible regardless of SSI
    if ([MovementTypes.t221, MovementTypes.t222].includes(movementType)) {
        wbsControl.setVisible(true);
    }
    if ([MovementTypes.t231].includes(movementType)) {
        salesOrderControl.setVisible(true);
        salesItemControl.setVisible(true);
    }

    // ICMTANGOAMF10-32227 Movement Type 411E add optional field Cost Center
    if ([MovementTypes.t411] .includes(movementType) && selectedSpecialStock === SpecialStock.OrdersOnHand) {
        costCenterControl.setVisible(true);
    } else if ([MovementTypes.t411] .includes(movementType) && selectedSpecialStock !== SpecialStock.OrdersOnHand) {
        costCenterControl.setVisible(false);
    }

    // after setting standard fields to show, check SSI for additional show/hide fields
    if (selectedSpecialStock === SpecialStock.ConsignmentVendor) {
        // show Vendor
        vendorControl.setVisible(true);
        storageLocationControl.setVisible(true);
    } else if (selectedSpecialStock === SpecialStock.PipelineStock) {
        // show Vendor
        // hide StorageLocation
        vendorControl.setVisible(true);
        storageLocationControl.setVisible(false);
    } else if (selectedSpecialStock === SpecialStock.ProjectStock) {
        // hide vendor
        vendorControl.setValue('');
        vendorControl.setVisible(false);
        wbsControl.setVisible(true);
    } else if (selectedSpecialStock === SpecialStock.OrdersOnHand) {
        // show sales order and sales order item
        // hide vendor
        salesOrderControl.setVisible(true);
        salesItemControl.setVisible(true);
        vendorControl.setValue('');
        vendorControl.setVisible(false);
    } else {
        vendorControl.setValue('');
        vendorControl.setVisible(false);
    }

    // if Sales Order and Item are not visible by default, then hide and reset value to ''
    // otherwise if user previously selected E and enter Sales Order data and changed
    // selection to Q, then SO data would still be there, so we need to remove SO value
    if (!salesOrderControl.getVisible() && !salesItemControl.getVisible()) {
        salesOrderControl.setVisible(false);
        salesItemControl.setVisible(false);
        salesOrderControl.setValue('');
        salesItemControl.setValue('');
    }

    // if WBS is not visible by default, then hide and reset value to ''
    // otherwise if user previously selected Q and enter WBS and changed
    // selection to E, then WBS data would still be there, so we need to remove WBS value
    if (!wbsControl.getVisible()) {
        wbsControl.setValue('');
    }

    return Promise.resolve();
}
