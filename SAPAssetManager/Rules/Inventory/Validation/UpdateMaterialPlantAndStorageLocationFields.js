import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import { setToSBin } from '../Stock/Transfer/OnSLocToToSelected';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
/**
* Describe this function...
* This function is called from MaterialListPicker onChange event on the IssueOrReceiptCreateUpdate.page
* When Material is changed, then the BatchList needs to be updated if the Material is batched.
* @param {IClientAPI} context
*/
export default function UpdateMaterialPlantAndStorageLocationFields(context) {
    ResetValidationOnInput(context);
    let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
    let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
    let batchToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumToListPicker');
    let autoSerialNumberSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('AutoSerialNumberSwitch');
    let serialNumButton = context.getPageProxy().getControl('FormCellContainer').getControl('SerialPageNav');
    let plantToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
    let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    let objectType = common.getStateVariable(context, 'IMObjectType');
    let move = common.getStateVariable(context, 'IMMovementType');
    let uom = context.getPageProxy().getControl('FormCellContainer').getControl('UOMSimple');
    let storageLocationListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
    let valuationTo = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationToPicker');
    let valuation = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
    let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');
    let storageBin = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
    let MatrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker').getValue();

    // required flags for the fields 
    let flags = {
        valuationFlag: false,
        valuationToFlag: false,
        batchIndicatorFlag: false,
        serial: false,
        quantityFlag: true,
        quantityClear: true,
        batchToIndicatorFlag: false,
    };
    // default values
    let values = {
        storageBinValue: '',
        uomValue: '',
        material: null,
        materialPlant: null,
        valuationItems: [],
        plantVaue: '',
        slocEntitySet: '',

    };
    // setting up the default value
    initvalueSetting(context);

    if (MatrialListPicker.length > 0) {

        values.plantVaue = SplitReadLink(context.getValue()[0].ReturnValue).Plant;
        let query = '$expand=Material,MaterialValuation_Nav,Material/SerialNumbers';
        let entitySet = MatrialListPicker[0].ReturnValue;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(async result => {
            if (result && result.length > 0) {
                values.materialPlant = result.getItem(0);
                values.material = values.materialPlant.MaterialNum;
                if (values.materialPlant.BatchIndicator === 'X') {
                    flags.batchIndicatorFlag = true;
                }
                if (values.materialPlant.SerialNumberProfile !== '') {
                    flags.serial = true;
                    flags.quantityFlag = false;
                    common.setStateVariable(context, 'MaterialReadLink', values.materialPlant['@odata.readLink']);
                }
                if (values.materialPlant.ValuationCategory) {
                    values.valuationItems = values.materialPlant.MaterialValuation_Nav;
                    flags.valuationFlag = true;
                }
                if (flags.batchIndicatorFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    flags.batchToIndicatorFlag = true;
                }
                if (flags.valuationFlag && (objectType === 'ADHOC' && move === 'T')) {
                    //check for the valuation for the 'to plant'
                    let valuationToFlagChecks = await context.read('/SAPAssetManager/Services/AssetManager.service', `MaterialPlants(Plant='${plantToListPicker.getValue()[0].ReturnValue}',MaterialNum='${values.material}')`, [], '$expand=Material,MaterialValuation_Nav');
                    if (valuationToFlagChecks && valuationToFlagChecks.length > 0 && valuationToFlagChecks.getItem(0).ValuationCategory) {
                        flags.valuationToFlag = true;
                    }
                }
                common.setStateVariable(context, 'SerialNumbers', { actual: null, initial: null });

                if (objectType === 'ADHOC') {
                    common.setStateVariable(context, 'BatchRequiredForFilterADHOC', flags.batchIndicatorFlag);
                }
                values.storageBinValue = '';
                values.uomValue = values.materialPlant.Material.BaseUOM;
            }
            settingValue(plant, values.plantVaue, true, true);
            settingValue(uom, values.uomValue, true, true);
            settingValue(storageBin, values.storageBinValue, true, true);
            settingValue(autoSerialNumberSwitch, '', flags.serial && move === 'R', flags.serial && move === 'R');
            settingValue(serialNumButton, '', flags.serial, flags.serial);
            
            if (flags.quantityClear) {
                settingValue(quantity, '', true, flags.quantityFlag);
            } else {
                settingValue(quantity, quantity.getValue()[0].ReturnValue, true, flags.quantityFlag);
            }
            // Refresh BatchListPicker depending upon GI or GR
            settingValue(batchListPicker, '', flags.batchIndicatorFlag, flags.batchIndicatorFlag);

            valuation.setVisible(flags.valuationFlag);
            valuationTo.setVisible(flags.valuationToFlag);

            if (flags.batchIndicatorFlag && objectType === 'ADHOC' && (move === 'R' || move === 'I' || move === 'T') && values.material && values.materialPlant) {
                let batchQuery = `$filter=MaterialNum eq '${values.material}' and Plant eq '${values.materialPlant.Plant}'`;
                if (move === 'I') { // For Good issue use MaterialBatchStockSet for others use MaterialBatches
                    const sloc = common.getListPickerValue(storageLocationListPicker.getValue());
                    batchQuery += ` and StorageLocation eq '${sloc}'`;
                    values.slocEntitySet = 'MaterialBatchStockSet';
                } else {
                    values.slocEntitySet = 'MaterialBatches';
                }

                let batchListSpecifier = batchListPicker.getTargetSpecifier();
                batchListSpecifier.setQueryOptions(batchQuery);
                batchListSpecifier.setEntitySet(values.slocEntitySet);
                batchListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');

                settingValue(batchListPicker, '', flags.batchIndicatorFlag, true);
                batchListPicker.setTargetSpecifier(batchListSpecifier);
                batchListPicker.redraw();
            }

            // if the movementType is 311 then there may not be a value for the plantToListPicker because the Plant is set by the From Plant
            // 311 is STO within same plant
            if (batchToListPicker && flags.batchToIndicatorFlag && objectType === 'ADHOC' && move === 'T' && values.material && plantToListPicker.getValue().length > 0) {
                // logic for batchTo picklist will be for Goods Receipt and STO which uses MaterialBatches
                let batchQuery = "$filter=MaterialNum eq '" + values.material + "' and Plant eq '" + plantToListPicker.getValue()[0].ReturnValue + "'";
                let batchToListSpecifier = batchToListPicker.getTargetSpecifier();
                batchToListSpecifier.setQueryOptions(batchQuery);
                batchToListSpecifier.setEntitySet('MaterialBatches');
                batchToListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                settingValue(batchListPicker, '', flags.batchIndicatorFlag, true);
                batchToListPicker.setTargetSpecifier(batchToListSpecifier);
                batchToListPicker.redraw();
            } // else set batchtolist to not visible??


            // if we have valuation items in the current values.material plant, then
            // we adding these items to the valuation type list picker
            // only for new case, old functionality stays same
            if (values.valuationItems.length && objectType === 'ADHOC') {
                let pickerItems = values.valuationItems.map(item => {
                    return {
                        'ReturnValue': item.ValuationType,
                        'DisplayValue': item.ValuationType,
                    };
                });
                valuation.setPickerItems(pickerItems);
                valuation.setEditable(true);
                if (flags.valuationToFlag) {
                    valuationTo.setPickerItems(pickerItems);
                    valuationTo.setEditable(true);
                }
            }
            let uomListPickerSpecifier = uom.getTargetSpecifier();
            uomListPickerSpecifier.setEntitySet('MaterialUOMs');
            uomListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            uom.setTargetSpecifier(uomListPickerSpecifier);
            uom.redraw();

            if (storageLocationToListPicker.getValue().length && plantToListPicker.getValue().length) {
                let moveStorageBin = context.getPageProxy().getControl('FormCellContainer').getControl('ToStorageBinSimple');
                let slocToVal = storageLocationToListPicker.getValue()[0].ReturnValue;
                let plantToVal = plantToListPicker.getValue()[0].ReturnValue;
                if (plantToVal && slocToVal && values.material) {
                    return context.read(
                        '/SAPAssetManager/Services/AssetManager.service',
                        'MaterialSLocs',
                        [],
                        "$select=StorageBin&$filter=MaterialNum eq '" + values.material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'",
                    ).then((val) => {
                        if (val && val.length === 0) {
                            return context.read(
                                '/SAPAssetManager/Services/OnlineAssetManager.service',
                                'MaterialSLocs',
                                [],
                                "$select=StorageBin&$filter=MaterialNum eq '" + values.material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'",
                            ).then((value) => {
                                return setToSBin(value, moveStorageBin);
                            }).catch(() => {
                                return setToSBin([], moveStorageBin);
                            });
                        } else {
                            return setToSBin(val, moveStorageBin);
                        }
                    });
                } else {
                    settingValue(moveStorageBin, '', true, false);
                    moveStorageBin.redraw();
                    return true;
                }
            }
            return true;
        });
    }
    //function for initial screen setup
    function initvalueSetting() {
        settingValue(batchListPicker, '', flags.batchIndicatorFlag, true);
        settingValue(batchListPicker, '', flags.batchIndicatorFlag, true);
        settingValue(storageBin, values.storageBinValue, true, true);
        settingValue(uom, values.uomValue, true, false);
        valuation.setVisible(flags.valuationFlag);
        valuation.setValue('');
        valuationTo.setValue('');
        valuationTo.setVisible(flags.valuationToFlag);
        valuation.setPickerItems([]);
        valuation.setEditable(flags.valuationFlag);
        valuationTo.setPickerItems([]);
        valuationTo.setEditable(flags.valuationToFlag);
    }


    //function for setting value, visibility, and editability for the fields
    function settingValue(fieldName, fieldValue, fieldVisible = true, fieldEditible = true) {
        fieldName.setValue(fieldValue);
        fieldName.setVisible(fieldVisible);
        fieldName.setEditable(fieldEditible);
    }
}
