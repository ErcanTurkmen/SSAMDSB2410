import { MovementTypes } from '../../Common/Library/InventoryLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnPlantToSelected(context) {
    let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    if (context.getValue().length > 0) {
        let value = context.getValue()[0].ReturnValue;
        let movementTypeLstPkr = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
        if (movementTypeLstPkr.getValue().length > 0) {
            let movementTypeValue = movementTypeLstPkr.getValue()[0].ReturnValue;
            if ([MovementTypes.t301, MovementTypes.t303, MovementTypes.t305].some(t => t === movementTypeValue)) {
                let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
                storageLocationToSpecifier.setEntitySet('StorageLocations');
                storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                storageLocationToSpecifier.setQueryOptions(`$filter=Plant eq '${value}'&$orderby=StorageLocation`);
                storageLocationToListPicker.setEditable(movementTypeValue !== MovementTypes.t305);
                storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
                storageLocationToListPicker.redraw();
            }
        }
    } else {
        storageLocationToListPicker.setEditable(false);
    }
    storageLocationToListPicker.setValue('');
    storageLocationToListPicker.redraw();
}
