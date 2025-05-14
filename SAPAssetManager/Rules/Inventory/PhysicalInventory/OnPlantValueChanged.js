import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import getBin from './Count/GetStorageBinAndBatchEnabled';
import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnPlantValueChanged(context) {
    ResetValidationOnInput(context);
    let value = libCom.getListPickerValue(context.getValue());

    if (!value) {
        value = '-1';
    }
    let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
    let storageLocationToSpecifier = storageLocationPicker.getTargetSpecifier();
    storageLocationToSpecifier.setQueryOptions(`$filter=Plant eq '${value}'&$orderby=StorageLocation`);
    storageLocationToSpecifier.setEntitySet('StorageLocations');
    storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    storageLocationPicker.setEditable(true);
    storageLocationPicker.setValue('');
    storageLocationPicker.setTargetSpecifier(storageLocationToSpecifier);
    storageLocationPicker.redraw();

    return refreshControls(context).then(() => {
        let binControl = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
    
        return getBin(context).then(function(result) {
            if (result[0]) {
                binControl.setValue(result[0]);
            } else {
                binControl.setValue('');
            }
            // Reset Batch list to blank since Plant was changed which impacts Storage Location which impacts Materials
            let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');   
            batchListPicker.setValue('');
            batchListPicker.setEditable(false);
            batchListPicker.redraw();
            return true;
        });
    });
}
