import IsWBSElementVisible from './IsWBSElementVisible';
import IsVendorVisible from './IsVendorVisible';
import IsStorageLocationVisible from './IsStorageLocationVisible';

export default function OnSpecialStockIndValueChanged(context) {
    const specialStockIndicator = (context.getValue().length) ? context.getValue()[0].ReturnValue : ''; //since special stock indicator is optional, it can be deselected
    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const [movementType, wbsElement, vendor, storageLocation] = ['MovementTypePicker', 'WBSElementSimple', 'VendorListPicker', 'StorageLocationPicker'].map(n => formcellContainer.getControl(n));
    const selectedMovementType = movementType.getValue()[0].ReturnValue;
    
    vendor.setVisible(IsVendorVisible(context, specialStockIndicator));
    storageLocation.setVisible(IsStorageLocationVisible(selectedMovementType, specialStockIndicator));
    IsWBSElementVisible(context, selectedMovementType, specialStockIndicator).then((wbsElementVisible) => {
        wbsElement.setVisible(wbsElementVisible); 
    }); 
}
