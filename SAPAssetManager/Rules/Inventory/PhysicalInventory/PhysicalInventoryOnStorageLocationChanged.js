import getBin from './Count/GetStorageBinAndBatchEnabled';
import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function PhysicalInventoryOnStorageLocationChanged(context) {
    ResetValidationOnInput(context);
    let plant;
    let storageLocation;

    if (context.getValue().length > 0) {
        plant = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue());
        storageLocation = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue());

        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let matrialListPickerSpecifier = matrialListPicker.getTargetSpecifier();
        if (plant && storageLocation) {
            matrialListPickerSpecifier.setQueryOptions(`$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$expand=Material&$orderby=MaterialNum,Plant,StorageLocation`);
            matrialListPickerSpecifier.setEntitySet('MaterialSLocs');
            matrialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            matrialListPicker.setEditable(true);
            matrialListPicker.setValue('');
            matrialListPicker.setTargetSpecifier(matrialListPickerSpecifier);
            matrialListPicker.redraw();
        }
    } else { //No sloc, show material list should be blank
        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let matrialListPickerSpecifier = matrialListPicker.getTargetSpecifier();
        matrialListPickerSpecifier.setQueryOptions("$filter=Plant eq '-1'");
        matrialListPickerSpecifier.setEntitySet('MaterialSLocs');
        matrialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        matrialListPicker.setEditable(true);
        matrialListPicker.setValue('');
        matrialListPicker.setTargetSpecifier(matrialListPickerSpecifier);
        matrialListPicker.redraw();
    }


    return refreshControls(context).then(() => {
        let binControl = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
        return getBin(context).then(function(result) {
            if (result[0]) {
                binControl.setValue(result[0]);
            } else {
                binControl.setValue('');
            }
            // Reset Batch list to blank and not editable since Storage Location which impacts Materials
            let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');   
            batchListPicker.setValue('');
            batchListPicker.setEditable(false);
            return true;
        });
    });
}
