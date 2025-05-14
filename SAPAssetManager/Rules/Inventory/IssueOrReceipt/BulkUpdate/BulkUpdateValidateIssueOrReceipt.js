
import { GetEDTControls } from './BulkUpdateLibrary';
import ShowMaterialBatchField from '../../Validation/ShowMaterialBatchField';
import IsStorageLocationReadOnly from './EDT/IsStorageLocationReadOnly';
import { SpecialStock } from '../../Common/Library/InventoryLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';
import { setQuantitiesAndReadLinkForDocument } from './BulkIssueOrReceiptPostUpdate';
import IsUoMReadOnly from './EDT/IsUoMReadOnly';
import { getQuantityInBaseUOM } from './BulkIssueOrReceiptPost';
import libMeasure from '../../../Measurements/MeasuringPointLibrary';
import { validateItemQuantityGreaterThanZero, validateItemQuantityIsValid, validateItemSerialNumber } from '../../Validation/ValidateIssueOrReceipt';
import ShowSerialNumberField from '../../Validation/ShowSerialNumberField';

export default function BulkUpdateValidateIssueOrReceipt(context) {
    const EDTControls = GetEDTControls(context);
    for (let control of EDTControls) {
        clearValidation(control);
    }
    const selectedItemsEDTControls = EDTControls.filter(control => control.getAllValues()[0].Properties?.ItemSelection);
    if (selectedItemsEDTControls.length === 0) {
        context.executeAction({ 
            'Name': '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('no_items_selected'),
                'Duration': 7,
                'Animated': true,
                '_Type': 'Action.Type.BannerMessage',
            },
        });
        return Promise.resolve(false);
    }
    let validationResult = [];
    selectedItemsEDTControls.forEach(async control => {  
        validationResult.push(validateItem(context, control));
    });
    return Promise.all(validationResult).then(results => {
        return results.every(result => result);
    });
}

function clearValidation(edtExtension) {
    if (!edtExtension.getRowBindings()?.[0]?.hasErrors) {
        return;
    }
    let cells = edtExtension.getAllCells();
    cells.forEach(cell => {
        cell.clearValidation();
    });
    edtExtension.getRowBindings()[0].hasErrors = false;
}

function validateItem(context, control) {
    const item = control.getAllValues()?.[0];
    let [quantity, storageLocation, otherFields] = [validateQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.Properties.Quantity, item),
        validateStorageLocation(context, item.OdataBinding, control.getRowCellByName(0, 'StorageLocation'), item.Properties.StorageLocation),
        validateOtherFields(context, item.OdataBinding, control.getRowCellByName(0, 'DetailsButton'), item)];
    return Promise.all([quantity, storageLocation, otherFields]).then(([qtyValid, slocValid, otherFieldsValid]) => {
        let isValid = true;
        isValid &= qtyValid;
        isValid &= slocValid;
        isValid &= otherFieldsValid;
        return isValid ? Promise.resolve(true) : Promise.resolve(false);
    });  
}

function validateStorageLocation(context, binding, control, storageLocation) {
    return isStorageLocationValid(context, binding, storageLocation).then((valid) => {
        if (!valid) {
            binding.hasErrors = true;
            control.applyValidation(context.localizeText('field_is_required'));
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    });
}

async function validateQuantity(context, binding, control, quantity, item) {
    // Quantity related errors - Precision, Value greater than zero, valid quantity, serialized number
    setQuantitiesAndReadLinkForDocument(binding, binding); //Set quantities for all different document types - PO, RES, STO, PRD
    binding.TempLine_OldQuantity = 0;
    binding.TempLine_QuantityInBaseUOM = IsUoMReadOnly(context, binding) ? quantity: await getQuantityInBaseUOM(context, item); //If UoM is readonly then baseQuantity will always be same as old

    let result = validateQuantityPrecision(context, quantity);
    if (!result.valid) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('invalid_item', [getItemNumber(binding), result.message]));
        return Promise.resolve(false);
    }
    result = await validateItemQuantityGreaterThanZero(context, item.Properties.Quantity, item.OdataBinding.AutoGenerateSerialNumbers, item.OdataBinding, item.OdataBinding.MovementType);
    if (!result.valid && result.field === 'QuantitySimple') {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('invalid_item', [getItemNumber(binding), result.message]));
        return Promise.resolve(false);
    }
    result = validateItemQuantityIsValid(context, item.OdataBinding, item.Properties.Quantity, item.OdataBinding.MovementType, undefined);
    if (!result.valid) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('invalid_item', [getItemNumber(binding), result.message]));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

async function validateOtherFields(context, binding, control, item) {
    if ( !isWBSElementValid(binding) || !isVendorValid(binding) || !isSalesOrderValid(binding) || !isSalesOrderItemValid(binding)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('forms_error_banner'));
        return Promise.resolve(false);
    }
    //In case of serialised materials, we need to display these errors for detail button as quantity field is not editable and the error message cannot be displayed on focus
    binding.TempLine_QuantityInBaseUOM = IsUoMReadOnly(context, binding) ? item.Properties.Quantity: await getQuantityInBaseUOM(context, item); //If UoM is readonly then baseQuantity will always be same as old
    let result = await validateItemQuantityGreaterThanZero(context, item.Properties.Quantity, item.OdataBinding.AutoGenerateSerialNumbers, item.OdataBinding, item.OdataBinding.MovementType);
    if (!result.valid && result.field === 'RequestedQuantitySimple') {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('forms_error_banner'));
        return Promise.resolve(false);
    }
    result = await ShowSerialNumberField(context, binding, binding.MovementType) ? validateItemSerialNumber(context, binding) : { valid: true, message: ''};
    if (!result.valid) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('forms_error_banner'));
        return Promise.resolve(false);
    }
    return isBatchValid(context, binding).then(valid => {
        if (!valid) {
            binding.hasErrors = true;
            control.applyValidation(context.localizeText('forms_error_banner'));
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    });
}

function isStorageLocationValid(context, binding, storageLocation) {
    if (ValidationLibrary.evalIsEmpty(storageLocation)) {
        return IsStorageLocationReadOnly(context, binding).then(readOnly => Promise.resolve(readOnly));
    }
    return Promise.resolve(true);
}

function isWBSElementValid(binding) {
    return !( binding.SpecialStockInd === SpecialStock.ProjectStock && ValidationLibrary.evalIsEmpty(binding.WBSElement));
}

function isVendorValid(binding) {
    return !( (binding.SpecialStockInd === SpecialStock.PipelineStock || binding.SpecialStockInd === SpecialStock.ConsignmentVendor) && ValidationLibrary.evalIsEmpty(binding.Vendor));
}

function isSalesOrderValid(binding) {
    return !( binding.SpecialStockInd === SpecialStock.OrdersOnHand && ValidationLibrary.evalIsEmpty(binding.SalesOrderNumber));
}

function isSalesOrderItemValid(binding) {
    return !( binding.SpecialStockInd === SpecialStock.OrdersOnHand && ValidationLibrary.evalIsEmpty(binding.SalesOrderItem));
}

function isBatchValid(context, binding) {
    if (ValidationLibrary.evalIsEmpty(binding.Batch)) {
        return ShowMaterialBatchField(context, false, binding).then(required => Promise.resolve(!required));
    }
    return Promise.resolve(true);
}

function validateQuantityPrecision(context, quantity) {
    const target = Math.max(0, Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue()));
    if (libMeasure.evalPrecision(libLocal.toNumber(context, quantity)) <= target) {
        return { valid: true, message: ''};
    }
    const message = (target > 0) ? context.localizeText('quantity_decimal_precision_of', [target]) : context.localizeText('quantity_integer_without_decimal_precision');
    return { valid: false, message: message};
}

function getItemNumber(binding) {
    if (binding.ReservationItem_Nav) {
        return binding.ReservationItem_Nav.ItemNum;
    } else if (binding.StockTransportOrderItem_Nav) {
        return binding.StockTransportOrderItem_Nav.ItemNum;
    } else if (binding.PurchaseOrderItem_Nav) {
        return binding.PurchaseOrderItem_Nav.ItemNum;
    } else if (binding.ProductionOrderComponent_Nav) {
        return binding.ProductionOrderComponent_Nav.ItemNum;
    }
    return '';
}
