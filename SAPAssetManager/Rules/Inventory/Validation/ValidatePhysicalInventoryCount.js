import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import ValidationLibrary, { RequiredDirective } from '../../Common/Library/ValidationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import getBin from '../PhysicalInventory/Count/GetStorageBinAndBatchEnabled';
import libInv, { SpecialStock } from '../Common/Library/InventoryLibrary';

export default function ValidatePhysicalInventoryCount(context) {

    let dict = libCom.getControlDictionaryFromPage(context);

    dict.QuantitySimple.clearValidation();

    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validatePrecisionWithinLimit(context, dict));
    validations.push(validateMaterialIsNotDuplicated(context, dict));
    validations.push(validateBatchNotEmptyIfRequired(context, dict));
    validations.push(validateTolerance(context, dict));
    validations.push(validateRequiredControl(dict.VendorListPicker));
    validations.push(validateRequiredControl(dict.WBSElementSimple));

    return Promise.all(validations).then(function() {
        return Promise.resolve(true);
    }).catch(function() {
        // Errors exist
        return Promise.resolve(false);
    });
}

/** @param {IListPickerFormCellProxy | IFormCellProxy | null} controlProxy  */
function validateRequiredControl(controlProxy) {
    return RequiredDirective(controlProxy, (control) => control?.visible).then(isValid => isValid ? Promise.resolve(true) : Promise.reject());
}

/**
 * Quantity must be > 0 if not zero count
 */
function validateQuantityGreaterThanZero(context, dict) {
    if (dict.ZeroCountSwitch.getValue() === true || libLocal.toNumber(context, dict.QuantitySimple.getValue()) > 0) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('pi_quantity_must_be_greater_than_zero');
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * quantity decimal precision must be within limits
 */
function validatePrecisionWithinLimit(context, dict) {

    let num = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let target = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (dict.ZeroCountSwitch.getValue() === true) {
        return Promise.resolve(true);
    }

    if (target < 0) {
        target = 0;
    }

    //Did user provide allowed decimal precision for quantity?
    if (Number(libMeasure.evalPrecision(num) > target)) {
        let message;
        if (target > 0) {
            let dynamicParams = [target];
            message = context.localizeText('quantity_decimal_precision_of', dynamicParams);
        } else {
            message = context.localizeText('quantity_integer_without_decimal_precision');
        }
        libCom.executeInlineControlError(context, dict.QuantitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * material number for PI item cannot be duplicated over all items on device
 */
function validateMaterialIsNotDuplicated(context, dict) {

    let onCreate = libCom.IsOnCreate(context);

    if (onCreate) {
        let material = libCom.getListPickerValue(dict.MatrialListPicker.getValue());
        let batch = libCom.getListPickerValue(dict.BatchListPicker.getValue());
        let plant;
        let storageLoc;

        if (dict.ItemPlantTitle) {
            plant = dict.ItemPlantTitle.getValue();
        } else {
            plant = libCom.getListPickerValue(dict.PlantLstPkr.getValue());
        }
        if (dict.ItemStorageLocationTitle) {
            storageLoc = dict.ItemStorageLocationTitle.getValue();
        } else {
            storageLoc = libCom.getListPickerValue(dict.StorageLocationPicker.getValue());
        }

        let query = "$filter=Material eq '" + material + "' and Plant eq '" + plant + "' and Batch eq '" + batch + "' and StorLocation eq '" + storageLoc + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', query).then(count => {
            if (count > 0) {
                libCom.executeInlineControlError(context, dict.MatrialListPicker, context.localizeText('pi_duplicate_material'));
                return Promise.reject();
            }
            return Promise.resolve(true);
        });
    }
    return Promise.resolve(true);
}

/**
* Batch field is required if material is batch enabled or valuation enabled
*/
function validateBatchNotEmptyIfRequired(context, dict) {
    if (libCom.IsOnCreate(context)) { //Only required if adding new PI
        return getBin(context).then(function(result) {
            if (result[1] || result[2]) {
                if (libCom.getListPickerValue(dict.BatchListPicker.getValue())) {
                    return Promise.resolve(true);
                }
                libCom.executeInlineControlError(context, dict.BatchListPicker, context.localizeText('field_is_required'));
                return Promise.reject();
            } else {
                return Promise.resolve(true);
            }
        });
    }
    return Promise.resolve(true);
}

/**
 * Validate tolerance
 */
async function validateTolerance(context, dict) {

    if ((dict.ZeroCountSwitch.getValue()) || (!libInv.getCheckToleranceLimitPhysicalInventory(context))) {
        return Promise.resolve(true);
    }
    let inventoryData = {};
    if (!context.binding || context.binding['@odata.type'].substring('#sap_mobile.'.length) === 'PhysicalInventoryDocHeader') {
        inventoryData.material = libCom.getListPickerValue(dict.MatrialListPicker.getValue());
        inventoryData.batch = libCom.getListPickerValue(dict.BatchListPicker.getValue());
        if (dict.ItemPlantTitle) {
            inventoryData.plant = dict.ItemPlantTitle.getValue();
        } else {
            inventoryData.plant = libCom.getListPickerValue(dict.PlantLstPkr.getValue());
        }
        inventoryData.plant = (dict.ItemPlantTitle) ? dict.ItemPlantTitle.getValue() : libCom.getListPickerValue(dict.PlantLstPkr.getValue());
        if (dict.ItemStorageLocationTitle) {
            inventoryData.storageLoc = dict.ItemStorageLocationTitle.getValue();
        } else {
            inventoryData.storageLoc = libCom.getListPickerValue(dict.StorageLocationPicker.getValue());
        }
        inventoryData.supplier = libCom.getListPickerValue(dict.VendorListPicker?.getValue()) || !ValidationLibrary.evalIsEmpty(context.binding?.PhysicalInventoryDocItem_Nav) && context.binding.PhysicalInventoryDocItem_Nav[0].Supplier || '';
        inventoryData.WBSElement = dict.WBSElementSimple?.getValue() || !ValidationLibrary.evalIsEmpty(context.binding?.PhysicalInventoryDocItem_Nav) && context.binding.PhysicalInventoryDocItem_Nav[0].WBSElement || '';
        inventoryData.specialStockInd = libCom.getListPickerValue(dict.SpecialStockIndicatorPicker?.getValue()) || context.binding?.SpecialStock || '';
        inventoryData.entryQuantity = libLocal.toNumber(context, dict.QuantitySimple.getValue()) || 0;
        return getToleranceDetails(context, inventoryData).then(function(result) {
            return Promise.resolve(result);
        });
    } else {
           return calculateItemTolerance(context, inventoryData);
    } 
}

function calculateItemTolerance(context, inventoryData) {
    inventoryData.material = context.binding.Material;
    inventoryData.plant = context.binding.Plant;
    inventoryData.batch = context.binding.Batch;
    inventoryData.storageLoc = context.binding.StorLocation;
    inventoryData.entryQuantity = context.binding.Temp_EntryQuantity || 0;
    inventoryData.specialStockInd = context.binding.PhysicalInventoryDocHeader_Nav?.SpecialStock || '';
   return GetPhysicalInventoryFirstItem(context).then(function(result) {
    inventoryData.supplier = context.binding.Supplier || result.Supplier;
    inventoryData.WBSElement = context.binding.WBSElement || result.WBSElement;
   
    return getToleranceDetails(context, inventoryData).then(function(tolerance) {
        return Promise.resolve(tolerance);
    });
   }); 
}

/**Get Material details */
export function getMaterialDetails(context, material, plant, batch, storageLoc, supplier, WBSElement) {
    let queryOptions = `$expand=MaterialBatchStock_Nav,MaterialPlants,MaterialSLocs,MaterialVendorConsignmentStock,MaterialProjectStock&$filter=MaterialNum eq '${material}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then(function(results) {
        if (!ValidationLibrary.evalIsEmpty(results)) {
            const materialDetail = results.getItem(0);
            const materialPlant = materialDetail.MaterialPlants?.find(item => item.Plant === plant);
            const materialSLoc = materialDetail.MaterialSLocs?.find(item => item.Plant === plant && item.StorageLocation === storageLoc);
            const materialBatch = materialDetail.MaterialBatchStock_Nav?.find(item => item.Plant === plant && item.StorageLocation === storageLoc && item.Batch === batch);
            const materialConsignment = materialDetail.MaterialVendorConsignmentStock?.find(item => item.Plant === plant && item.StorageLocation === storageLoc && item.Batch === batch && item.Supplier === supplier && item.SpecialStock === SpecialStock.ConsignmentVendor);
            const materialProjectStock = materialDetail.MaterialProjectStock?.find(item => item.Plant === plant && item.StorageLocation === storageLoc && item.Batch === batch && item.WBSElement === WBSElement && item.SpecialStock === SpecialStock.ProjectStock);
            return [materialPlant, materialSLoc, materialBatch, materialConsignment, materialProjectStock];
        }
        return Promise.reject('Error: Material details not found');
    });
}

/**Get tolerance details */
export function getToleranceDetails(context, inventoryData) {
    return getMaterialDetails(context, inventoryData.material, inventoryData.plant, inventoryData.batch, inventoryData.storageLoc, inventoryData.supplier, inventoryData.WBSElement).then(function([materialPlant, materialSLoc, materialBatch, materialVendor, materialProject]) {
        if (inventoryData.specialStockInd === SpecialStock.ConsignmentVendor) {
            const quantity = Number(materialVendor?.UnrestrictedQty);
            return calculateTolerance(context, inventoryData.entryQuantity, quantity);
        } else if (inventoryData.specialStockInd === SpecialStock.ProjectStock) {
            const quantity = Number(materialProject?.UnrestrictedQty);
            return calculateTolerance(context, inventoryData.entryQuantity, quantity);
        } else if (materialPlant.BatchIndicator || materialPlant.ValuationCategory) {
            const quantity = Number(materialBatch?.UnrestrictedQuantity);
            return calculateTolerance(context, inventoryData.entryQuantity, quantity);
        } else {
            const quantity = Number(materialSLoc?.UnrestrictedQuantity);
            return calculateTolerance(context, inventoryData.entryQuantity, quantity);
        }
    });
}


/*Calculate physical inventory tolerance */
export function calculateTolerance(context, entryQuantity, quantity) {
    const tolerance = libInv.getToleranceLimitPercentPhysicalInventory(context);
    const captionText = context.localizeText('warning');
    const upperLimit = Math.round((quantity + (quantity * (tolerance / 100))));
    const lowerLimit = Math.round((quantity - (quantity * (tolerance / 100))));
    if ((entryQuantity > upperLimit) || (entryQuantity < lowerLimit)) {
     const messageText = context.localizeText('pi_exceed_tolerance_x', [entryQuantity]);
        return libCom.showWarningDialog(context, messageText, captionText);
    }
    return Promise.resolve(true);
}

function GetPhysicalInventoryFirstItem(context) {
    
    const baseQuery = `$filter=(PhysInvDoc eq '${context.binding.PhysInvDoc}' and FiscalYear eq '${context.binding.FiscalYear}')&$orderby=Item &$top=1`;    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', [], baseQuery).then(results => {
        return ValidationLibrary.evalIsEmpty(results) && results.getItem(0);
    });   
    }
