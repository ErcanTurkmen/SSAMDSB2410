import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
import IssueOrReceiptSignatureWatermark from '../IssueOrReceipt/IssueOrReceiptSignatureWatermark';

export default async function OnStorageLocationChanged(context) {
    ResetValidationOnInput(context);
    let movementTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
    let plantToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
    let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    let plantPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
    let materialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
    let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let slocToQuery = "$filter=Plant eq '-1'";
    let materialEditable = false;
    let slocToEditable = false;
    let slocToValue = '';
    let influenceOnMaterial = true;
    let type, plant, sloc;
    if (movementTypePicker.getValue().length > 0) {
        type = movementTypePicker.getValue()[0].ReturnValue;
    }
    // context is the storageLocation list picker.
    // if the user deselects storagelocation then the array is empty and length is 0
    // Do we need to reset the BatchPickerList to empty?
    if (context.getValue().length > 0 && plantPicker.getValue().length > 0) {
        sloc = context.getValue()[0].ReturnValue;
        plant = plantPicker.getValue()[0].ReturnValue;
        if (plant && sloc) {
            materialEditable = true;
            if ([MovementTypes.t311, MovementTypes.t313, MovementTypes.t411].some(t => t === type)) {
                slocToQuery = `$filter=Plant eq '${plant}' and StorageLocation ne '${sloc}'&$orderby=Plant,StorageLocation`;
                slocToEditable = true;
            } else if (type === MovementTypes.t315) {
                    slocToQuery = `$filter=Plant eq '${plant}'&$orderby=Plant,StorageLocation`;
                    slocToValue = sloc;
            } else if ([MovementTypes.t321, MovementTypes.t322, MovementTypes.t343].includes(type)) {
                slocToQuery = `$filter=Plant eq '${plant}' and StorageLocation eq '${sloc}'&$orderby=Plant,StorageLocation`;
            } else if (type === MovementTypes.t301) {
                if (plantToListPicker.getValue().length > 0) {
                    let plantTo = plantToListPicker.getValue()[0].ReturnValue;
                    slocToQuery = `$filter=Plant eq '${plantTo}'&$orderby=Plant,StorageLocation`;
                    slocToEditable = true;
                }
            } else if (type === MovementTypes.t303) {
                slocToQuery = `$filter=Plant eq '${plant}'&$orderby=Plant,StorageLocation`;
                slocToEditable = true;
            } else if (type === MovementTypes.t305) {
                slocToQuery = `$filter=Plant eq '${plant}' and StorageLocation eq '${sloc}'&$orderby=Plant,StorageLocation`;
                slocToValue = sloc;
            }
        }
    }
    if ([MovementTypes.t501,MovementTypes.t502].includes(type)) {
        influenceOnMaterial = false;
    } else {
        if (sloc) {
            libCom.setStateVariable(context, 'MaterialSLocValue', sloc);
        } else {
            libCom.setStateVariable(context, 'MaterialSLocValue', '-1');
        }
    }
    if (influenceOnMaterial) {
        materialListPicker.setEditable(materialEditable);
        materialListPicker.redraw();
    }

    let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
    storageLocationToSpecifier.setQueryOptions(slocToQuery);
    storageLocationToSpecifier.setEntitySet('StorageLocations');
    storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    storageLocationToListPicker.setEditable(slocToEditable);
    storageLocationToListPicker.setValue(slocToValue);
    storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
    storageLocationToListPicker.redraw();

    //fetch plant and storage location values and store in state variables and update signature watermark with updated ones
        const Plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple').getValue()[0]?.ReturnValue;
        const StorageLocation = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue()[0]?.ReturnValue;
        libCom.setStateVariable(context,'WatermarkPlant',Plant);
        libCom.setStateVariable(context, 'WatermarkStorageLocation',StorageLocation);
    
        const watermark = await IssueOrReceiptSignatureWatermark(context);
        const signature = context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell');
        signature.setWatermarkText(watermark);
        signature.redraw();

    if (context.getValue().length > 0) {
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        if (objectType !== 'ADHOC') {
            let material;
            let plantVal;
            let storageLocation;
            if (!libVal.evalIsEmpty(context.binding)) {
                if (!libVal.evalIsEmpty(context.binding.Material)) {
                    material = context.binding.Material;
                } else if (!libVal.evalIsEmpty(context.binding.MaterialNum)) {
                    material = context.binding.MaterialNum;
                }

// For Work Orders (Goods Issue): 
// the context.binding.Plant is undefined
// the context.binding.SupplyPlant is defined ‘1000’ (that is the user’s default Plant)

// For Stock Transfer Orders (Goods Issue):  
// the context.binding.Plant is ‘1100’ (which is the target plant)
// the context.binding.SupplyPlant is undefined (that should be the user’s default Plant)
// there could be bug here because SupplyPlant should have been populated correctly at this point
// instead, using the supplyplant from the header.
                if (movementType === 'I' && type === MovementTypes.t351) {
                    if (allowIssue(context)) { //Issue so use supply plant
                        plantVal = context.binding.StockTransportOrderHeader_Nav.SupplyingPlant;
                    } else {
                        plantVal = context.binding.Plant;
                    }
                } else if (!libVal.evalIsEmpty(context.binding.Plant)) {
                    plantVal = context.binding.Plant;
                } else if (!libVal.evalIsEmpty(context.binding.SupplyPlant)) {
                    plantVal = context.binding.SupplyPlant;
                }

                if (!libVal.evalIsEmpty(context.getValue()[0].ReturnValue)) {
                    storageLocation = context.getValue()[0].ReturnValue;
                }
            }
            //
            // If MovementType is of Goods Issue "I", need to set BatchListPicker to new value list with selected MaterialNum, Plant and Storage Location.
            //
            if ( movementType === 'I' && material && plantVal && storageLocation) {
                let batchQuery = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantVal + "' and StorageLocation eq '" + storageLocation+ "'";
                let batchListSpecifier = batchListPicker.getTargetSpecifier();
                batchListSpecifier.setQueryOptions(batchQuery);
                batchListSpecifier.setEntitySet('MaterialBatchStockSet');
                batchListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                batchListPicker.setEditable(true);
                batchListPicker.setValue('');
                batchListPicker.setTargetSpecifier(batchListSpecifier);
                batchListPicker.redraw();
            }

            let storageBinSimple = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
            if (material && plantVal && storageLocation) {
                return context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MaterialSLocs',
                    [],
                    "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantVal + "' and StorageLocation eq '" + storageLocation + "'").then(result => {
                        if (result && result.length > 0) {
                            // Grab the first row (should only ever be one row)
                            let row = result.getItem(0);
                            storageBinSimple.setValue(row.StorageBin);
                        } else {
                            storageBinSimple.setValue('');
                        }
                        storageBinSimple.redraw();
                        return true;
                    });
            } else {
                storageBinSimple.setValue('');
                storageBinSimple.redraw();
            }
        }
        return true;
    }
}
