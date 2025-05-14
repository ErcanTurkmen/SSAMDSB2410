import libCom from '../../Common/Library/CommonLibrary';
import showBatch from './ShowMaterialBatchField';
import ShowSerialNumberField from './ShowSerialNumberField';
import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import showMaterialNumberListPicker from './ShowMaterialNumberListPicker';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import Logger from '../../Log/Logger';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import ValidationLibrary, { CustomDirective, RequiredDirective } from '../../Common/Library/ValidationLibrary';
import libInv, { MovementTypes, SpecialStock, EditableGRBlockReleaseMovementTypes, EditableGRBlockedMovementTypes, GoodsMovementCode } from '../Common/Library/InventoryLibrary';
import { getMaterialDetails } from './ValidatePhysicalInventoryCount';
export default function ValidateIssueOrReceipt(context, binding) {

    const fcContainer = context.getControl('FormCellContainer');

    let storageLocationPicker = fcContainer.getControl('StorageLocationPicker');
    // boolean used if storageLocation is not visible, then validation is not required.
    const isStorageLocationRequired = storageLocationPicker.visible;

    const [QuantitySimple, MatrialListPicker, MovementReasonPicker, StorageLocationPicker, MovementTypePicker, SpecialStockIndicatorPicker,
        BatchListPicker, RequestedQuantitySimple, AutoSerialNumberSwitch, PlantToListPicker, StorageLocationToListPicker,
        BatchNumToListPicker, CostCenterSimple, WBSElementSimple, SalesOrderSimple, SalesOrderItemSimple,
        OrderSimple, NetworkSimple, ActivitySimple, NumOfLabels, UOMSimple, BaseQuantityUOM, VendorListPicker] = [
            'QuantitySimple', 'MatrialListPicker', 'MovementReasonPicker', 'StorageLocationPicker', 'MovementTypePicker', 
            'SpecialStockIndicatorPicker','BatchListPicker', 'RequestedQuantitySimple', 'AutoSerialNumberSwitch', 'PlantToListPicker', 'StorageLocationToListPicker',
            'BatchNumToListPicker', 'CostCenterSimple', 'WBSElementSimple', 'SalesOrderSimple', 'SalesOrderItemSimple',
            'OrderSimple', 'NetworkSimple', 'ActivitySimple', 'NumOfLabels', 'UOMSimple', 'BaseQuantityUOM', 'VendorListPicker'].map(n => fcContainer.getControl(n));
    [QuantitySimple, MatrialListPicker, MovementReasonPicker, StorageLocationPicker, MovementTypePicker,SpecialStockIndicatorPicker,
        MovementReasonPicker, BatchListPicker, RequestedQuantitySimple, AutoSerialNumberSwitch, NumOfLabels, BaseQuantityUOM, VendorListPicker].forEach(c => c.clearValidation());

    const movementType = libCom.getListPickerValue(MovementTypePicker.getValue());
    const specialStockIndicator = libCom.getListPickerValue(SpecialStockIndicatorPicker.getValue());
    // if value == E, then sales order and item required
    // if value == P or K, then Vendor required,
    // if value == P, then no storage location required
    // if value == Q, then WBS required

    const target = Math.max(0, Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue()));
    /* eslint-disable no-unused-vars */
    const validations = [
        RequiredDirective(MovementReasonPicker, ((control) => [MovementTypes.t551, MovementTypes.t552, MovementTypes.t122].includes(movementType))), // Movement reason cannot be blank of movement type is 122, 551
        RequiredDirective(MatrialListPicker, ((control) => ((libCom.getPreviousPageName(control.getPageProxy()) !== 'StockDetailsPage') && showMaterialTransferToFields(control.getPageProxy())) || showMaterialNumberListPicker(control.getPageProxy()))),
        RequiredDirective(PlantToListPicker, ((control) => showMaterialTransferToFields(control.getPageProxy()))),
        RequiredDirective(StorageLocationToListPicker, ((control) => showMaterialTransferToFields(control.getPageProxy()) && (movementType !== MovementTypes.t303))),
        // if free-text of non-stock material then storagelocation not required
        RequiredDirective(StorageLocationPicker, ((control) => isStorageLocationRequired && specialStockIndicator !== 'P' && ![MovementTypes.t103, MovementTypes.t104, MovementTypes.t124, MovementTypes.t107, MovementTypes.t108].includes(movementType))),
        RequiredDirective(MovementTypePicker),
        RequiredDirective(BatchListPicker, ((control) => showBatch(control.getPageProxy(), true))), // Check that batch is provided when material is batch enabled
        RequiredDirective(BatchNumToListPicker, ((control) => Promise.all([showBatch(control.getPageProxy(), true), showMaterialTransferToFields(control.getPageProxy())]).then(results => results.every(i => !!i)))),
        RequiredDirective(CostCenterSimple, ((control) => [MovementTypes.t551, MovementTypes.t552, MovementTypes.t553, MovementTypes.t555, MovementTypes.t201, MovementTypes.t202].includes(movementType) && control.getEditable())),
        RequiredDirective(WBSElementSimple, ((control) => [MovementTypes.t221, MovementTypes.t222].includes(movementType) || specialStockIndicator === SpecialStock.ProjectStock && control.getEditable())),
        RequiredDirective(SalesOrderSimple, ((control) => MovementTypes.t231 === movementType || specialStockIndicator === SpecialStock.OrdersOnHand)),
        RequiredDirective(SalesOrderItemSimple, ((control) => MovementTypes.t231 === movementType || specialStockIndicator === SpecialStock.OrdersOnHand)),
        RequiredDirective(OrderSimple, ((control) => [MovementTypes.t261, MovementTypes.t262].includes(movementType) && control.getEditable())),
        RequiredDirective(NetworkSimple, ((control) => [MovementTypes.t281, MovementTypes.t282].includes(movementType) && control.getEditable())),
        RequiredDirective(ActivitySimple, ((control) => [MovementTypes.t281, MovementTypes.t282].includes(movementType) && control.getEditable())),
        RequiredDirective(VendorListPicker, ((control) => specialStockIndicator === SpecialStock.PipelineStock || specialStockIndicator === SpecialStock.ConsignmentVendor)),
        RequiredDirective(UOMSimple, ((control) => control.getEditable())),
        CustomDirective(QuantitySimple, //Did user provide allowed decimal precision for quantity?
            (control) => libMeasure.evalPrecision(libLocal.toNumber(control, control.getValue())) <= target, (control) => true,
            (control) => target > 0 ? context.localizeText('quantity_decimal_precision_of', [target]) : context.localizeText('quantity_integer_without_decimal_precision')),
    ];
    /* eslint-enable no-unused-vars */
    validations.push(validateQuantityGreaterThanZero(context, QuantitySimple, AutoSerialNumberSwitch, RequestedQuantitySimple));
    validations.push(validateQuantityIsValid(context, QuantitySimple, movementType));

    validations.push(validateNumberOfLabels(NumOfLabels));

    validations.push(DocumentValidate(context));

    validations.push(validateSerialNumber(context, binding, BaseQuantityUOM));

    validations.push(validateZeroStock(context, binding));

    return Promise.all(validations).then(results => results.every(i => i));
}

/**
 * This function checks if the quantity is greater then zero. In case quantity is invalid, it returns appropriate error message and the field to which error message should be applied.
 */
export function validateItemQuantityGreaterThanZero(context, quantity, autoSerialNumber = false, bindingObject = undefined, selectedMovementType = '') {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const binding = bindingObject || context.binding;
    const type = (binding?.['@odata.type'] || '').substring('#sap_mobile.'.length);
    const error = { message: 'quantity_must_be_greater_than_zero', field: 'QuantitySimple' };

    return ShowSerialNumberField(context, bindingObject, selectedMovementType).then(show => {
        if (objectType === 'ADHOC' || objectType === 'TRF') {
            if (libLocal.toNumber(context, quantity)) {
                return { valid: true, message: '', field: undefined };
            }
        } else {
            if (!show) {
                if (libLocal.toNumber(context, quantity)) {
                    return { valid: true, message: '', field: undefined };
                }
            } else {
                if (autoSerialNumber) {
                    if (libLocal.toNumber(context, quantity)) {
                        return { valid: true, message: '', field: undefined };
                    }
                } else {
                    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers')?.actual;
                    const serialNumbers = actualNumbers && actualNumbers.filter(item => item.selected).length;

                    if (type === 'MaterialDocItem') {
                        if ((serialNumbers && serialNumbers !== 0) || (bindingObject?.SerialNum.length)) {
                            return { valid: true, message: '', field: undefined };
                        }
                    } else {
                        if (serialNumbers || (bindingObject?.SerialNum.length)) {
                            return { valid: true, message: '', field: undefined };
                        }
                    }

                    error.message = 'confirmed_quantity_change';
                    error.field = 'RequestedQuantitySimple';
                }
            }
        }
        return { valid: false, message: context.localizeText(error.message), field: error.field };
    });
}

/**
 * This functions sets inline error message when quantity is not greater than zero
 */
function validateQuantityGreaterThanZero(context, QuantitySimple, AutoSerialNumberSwitch, RequestedQuantitySimple) {
    return validateItemQuantityGreaterThanZero(context, QuantitySimple.getValue(), AutoSerialNumberSwitch.getValue()).then((result) => {
        if (result.valid) {
            return true;
        }
        const errorField = (result.field === 'QuantitySimple') ? QuantitySimple : RequestedQuantitySimple;
        libCom.executeInlineControlError(context, errorField, result.message);
        return false;
    });
}

/**
 *
 * Quantity cannot be greater than open
 */
export function validateItemQuantityIsValid(context, bindingObject, qty, movementType, QuantitySimple) {
    let open;
    let message = '';
    let underDeliveryTol = 0;
    let remainingTol = 0;
    let totalReceived = 0;
    let receivedQuantity = 0;
    let openRequired = false;
    let tolerance = true;
    let unlimitedTol = false;
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let openQuantityBlocked, openQtyValBlocked, openQuantity;
    let unlimitedTolFlag = '';
    if (!context.binding) {
        return { valid: true, message: '', field: undefined };
    }
    let binding = bindingObject || context.binding;
    if (binding.TempLine_QuantityInBaseUOM > 0) {
        qty = binding.TempLine_QuantityInBaseUOM;
    }
    if (type === 'PO') {
        let param = Object({
            binding: binding,
            openQuantity: openQuantity,
            openQuantityBlocked: openQuantityBlocked,
            openQtyValBlocked: openQtyValBlocked,
            open: open,
            openRequired: openRequired,
            movementType: movementType,
            underDeliveryTol: underDeliveryTol,
            receivedQuantity: receivedQuantity,
            totalReceived: totalReceived,
            qty: qty,
            remainingTol: remainingTol,
            tolerance: tolerance,
            message: message,
            QuantitySimple: QuantitySimple,
            unlimitedTolFlag: unlimitedTolFlag,
        });
        param = validatePOQuantity(context, param);
        if (param.UnderDeliveryTolMessage) {
            return { valid: false, message: param.UnderDeliveryTolMessage, field: QuantitySimple };
        }
        if (param.OverDeliveryTolMessage) {
            return { valid: false, message: param.OverDeliveryTolMessage, field: QuantitySimple };
        }
        open = param.open;
        openRequired = param.openRequired;
        tolerance = param.tolerance;
        unlimitedTol = param.unlimitedTol;
    } else if (type === 'PRD' && move === 'R' || type === 'RES' || (type === 'PRD' && move === 'I')) {
        open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
        openRequired = true;
    } else if (type === 'STO') {
        if (move === 'R') { //Receipt
            open = Number(binding.TempItem_IssuedQuantity) - Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_OldQuantity);
        } else { //Issue
            open = Number(binding.TempItem_OrderQuantity) - Number(binding.TempItem_IssuedQuantity) + Number(binding.TempLine_OldQuantity);
        }
        openRequired = true;
    } else if (type === 'REV') {
        open = Number(binding.TempLine_OldQuantity);
        openRequired = true;
    }
    if (!tolerance) {
        return { valid: false, message: '', field: undefined };
    }
    //  adjust calculation and quantity for the case of movement changes
    if ((qty <= open || !openRequired || unlimitedTol)) {
        return { valid: true, message: '', field: undefined };
    }
    message = context.localizeText('po_item_receiving_quantity_failed_validation_message', [open]);
    return { valid: false, message: message, field: QuantitySimple };
}
/**
 * This functions sets inline error message when Quantity is greater than open
 */
function validateQuantityIsValid(context, QuantitySimple, movementType) {
    const validationResult = validateItemQuantityIsValid(context, undefined, QuantitySimple.getValue(), movementType, QuantitySimple);
    if (validationResult.valid) {
        return true;
    }
    libCom.executeInlineControlError(context, validationResult.field, validationResult.message);
    return false;
}
//Check PO quantity
function validatePOQuantity(context, object) {
    let param = object;
    [param.openQuantityBlocked, param.openQtyValBlocked, param.open, param.openRequired] = getOpenQuantity(param);
    if (!(EditableGRBlockReleaseMovementTypes.includes(param.movementType))) {
        [param.receivedQuantity, param.totalReceived, param.remainingTol, param.tolerance, param.UnderDeliveryTolMessage] = getUnderDeliveryTolerance(context, param);
        [param.tolerance, param.open, param.unlimitedTol, param.OverDeliveryTolMessage] = getOverDeliveryTolerance(context, param);
    }
    return param;
}
//Get the Over Delivery tolerance for PO
function getOverDeliveryTolerance(context, object) {
    let param = object;
    if (param.binding.UnlimitedTol !== undefined) {
        param.unlimitedTolFlag = param.binding.UnlimitedTol;
    } else if (param.binding.PurchaseOrderItem_Nav.UnlimitedTol !== undefined) {
        param.unlimitedTolFlag = param.binding.PurchaseOrderItem_Nav.UnlimitedTol;
    }
    param.unlimitedTol = !!param.unlimitedTolFlag;
    if (param.unlimitedTol) {
        return [param.tolerance, param.open, param.unlimitedTol];
    }
    let overDeliveryTol = 0;
    if (param.binding.OverDeliveryTol !== undefined) {
        overDeliveryTol = (param.binding.OverDeliveryTol === param.binding.OrderQuantity) ? 0 : param.binding.OverDeliveryTol;
    } else if (param.binding.PurchaseOrderItem_Nav.OverDeliveryTol !== undefined) {
        overDeliveryTol = (param.binding.PurchaseOrderItem_Nav.OverDeliveryTol === param.binding.PurchaseOrderItem_Nav.OrderQuantity) ? 0 : param.binding.PurchaseOrderItem_Nav.OverDeliveryTol;
    }
    param.remainingTol = Number(overDeliveryTol) - Number(param.receivedQuantity);
    if (overDeliveryTol) {
        if (Number(param.totalReceived) > Number(overDeliveryTol)) {
            param.tolerance = false;
            param.message = context.localizeText('po_item_overdelivery_tol', [param.remainingTol]);
        } else {
            param.open = Number(param.remainingTol);
        }
    }
    return [param.tolerance, param.open, param.unlimitedTol, param.message];
}
//Get the under Delivery tolerance for PO
function getUnderDeliveryTolerance(context, object) {
    let param = object;
    if (param.binding.UnderDeliveryTol !== undefined) {
        param.underDeliveryTol = (param.binding.UnderDeliveryTol === param.binding.OrderQuantity) ? 0 : param.binding.UnderDeliveryTol;
    } else if (param.binding.PurchaseOrderItem_Nav.UnderDeliveryTol !== undefined) {
        param.underDeliveryTol = (param.binding.PurchaseOrderItem_Nav.UnderDeliveryTol === param.binding.PurchaseOrderItem_Nav.OrderQuantity) ? 0 : param.binding.PurchaseOrderItem_Nav.UnderDeliveryTol;
    }
    if (param.binding.ReceivedQuantity !== undefined) {
        param.receivedQuantity = (Number(param.binding.ReceivedQuantity) > 0) ? Number(param.binding.ReceivedQuantity) - Number(param.binding.TempLine_OldQuantity) : 0;
    } else if (param.binding.PurchaseOrderItem_Nav.ReceivedQuantity !== undefined) {
        param.receivedQuantity = (Number(param.binding.PurchaseOrderItem_Nav.ReceivedQuantity) > 0) ? Number(param.binding.PurchaseOrderItem_Nav.ReceivedQuantity) - Number(param.binding.TempLine_OldQuantity) : 0;
    }
    if (EditableGRBlockedMovementTypes.includes(param.movementType)) {
        param.totalReceived = Number(param.qty) + Number(param.receivedQuantity);
    } else {
        param.totalReceived = Number(param.qty) + Number(param.receivedQuantity) + Number(param.openQtyValBlocked)
            + Number(param.openQuantityBlocked);
    }
    if (param.underDeliveryTol) {
        if (Number(param.totalReceived) < Number(param.underDeliveryTol)) {
            param.remainingTol = Number(param.underDeliveryTol) - Number(param.receivedQuantity);
            param.tolerance = false;
            param.message = context.localizeText('po_item_underdelivery_tol', [param.remainingTol]);
        }
    }
    return [param.receivedQuantity, param.totalReceived, param.remainingTol, param.tolerance, param.message];
}
//Get the open quantity values for the PO
function getOpenQuantity(object) {
    let param = object;
    switch (param.movementType) {
        case MovementTypes.t101:
        // eslint-disable-next-line no-fallthrough
        case MovementTypes.t103:
        // eslint-disable-next-line no-fallthrough
        case MovementTypes.t107: {
            if (param.binding.OpenQuantity !== undefined) {
                param.openQuantity = param.binding.OpenQuantity;
                param.openQuantityBlocked = param.binding.OpenQuantityBlocked;
                param.openQtyValBlocked = param.binding.OpenQtyValBlocked;
            } else if (param.binding.PurchaseOrderItem_Nav !== undefined) {
                param.openQuantity = param.binding.PurchaseOrderItem_Nav.OpenQuantity;
                param.openQuantityBlocked = param.binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
                param.openQtyValBlocked = param.binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
            }
            param.open = Number(param.openQuantity) + Number(param.binding.TempLine_OldQuantity);
            param.openRequired = true;
            break;
        }
        case MovementTypes.t105:
            if (param.binding.OpenQuantityBlocked !== undefined) {
                param.openQuantityBlocked = param.binding.OpenQuantityBlocked;
            } else if (param.binding.PurchaseOrderItem_Nav !== undefined) {
                param.openQuantityBlocked = param.binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
            }
            param.open = Number(param.openQuantityBlocked) + Number(param.binding.TempLine_OldQuantity);
            param.openRequired = true;
            break;
        case MovementTypes.t109: {
            if (param.binding.OpenQtyValBlocked !== undefined) {
                param.openQtyValBlocked = param.binding.OpenQtyValBlocked;
            } else if (param.binding.PurchaseOrderItem_Nav !== undefined) {
                param.openQtyValBlocked = param.binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
            }
            param.open = Number(param.openQtyValBlocked) + Number(param.binding.TempLine_OldQuantity);
            param.openRequired = true;
            break;
        }
        default: {
            // ignore quantity check, openRequired remains false
            break;
        }
    }
    return [param.openQuantityBlocked, param.openQtyValBlocked, param.open, param.openRequired];
}

/** @param {IControlProxy} control */
export function validateNumberOfLabels(control) {
    if (control.getVisible() && !ValidationLibrary.evalIsEmpty(control.getValue())) {
        const value = control.getValue();
        const num = libLocal.toNumber(control, value);
        const limit = control.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/NumberOfLabelsFieldLength.global').getValue();
        let validationMsg = '';
        if (value.length > limit) {
            validationMsg = control.localizeText('validation_maximum_field_length', [limit]);
        } else if (libMeasure.evalPrecision(num) > 0) {
            validationMsg = control.localizeText('forms_numeric_integer');
        } else if (Number.isNaN(num) || num < 0) {
            validationMsg = control.localizeText('validation_value_greater_than_or_equal_to_zero');
        }
        if (validationMsg) {
            libCom.executeInlineControlError(control, control, validationMsg);
            return false;
        }
    }
    return true;
}

/**
 *
 * Serial number should match with quantity
 */
export function validateItemSerialNumber(context, binding) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers')?.actual || (context.binding?.SerialNum) || [];
    const serialNumbers = actualNumbers && actualNumbers.filter(item => item.selected).length;
    if (serialNumbers) {
        if (serialNumbers === binding.TempLine_QuantityInBaseUOM) {
            return { valid: true, message: '' };
        }
        return { valid: false, message: context.localizeText('serial_number_count', [serialNumbers, binding.TempLine_QuantityInBaseUOM]) };
    }
    return { valid: true, message: '' };
}
/**
 * This functions sets inline error message when Serial number does not match with quantity
 */
function validateSerialNumber(context, binding, BaseQuantityUOM) {
    const validationResult = validateItemSerialNumber(context, binding);
    if (validationResult.valid) {
        return true;
    }
    libCom.executeInlineControlError(context, BaseQuantityUOM, validationResult.message);
    return false;
}

export function DocumentValidate(context) {
    let valPromises = [];
    const descriptionCtrl = context.getControl('FormCellContainer').getControl('AttachmentDescription');
    const charLimitInt = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();
    const signatory = context.getControl('FormCellContainer').getControl('Signatory');

    // attachment description validation
    if (!ValidationLibrary.evalIsEmpty(descriptionCtrl)) {
        //Clear previous inline errors if any
        descriptionCtrl.clearValidation();
        valPromises.push(DocumentLibrary.validationCharLimit(context, descriptionCtrl, charLimitInt));
    }

    //signatory validation
    if (!ValidationLibrary.evalIsEmpty(signatory)) {
        //Clear previous inline errors if any
        signatory.clearValidation();
        valPromises.push(validationSignatory(context, signatory));
    }

    return Promise.all(valPromises).then(() => {
        return true;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        return Promise.reject();
    });
}
/*Validate Zero stock */
export function validateZeroStock(context, binding) {
    binding = context.binding || binding;
    return getDebitCredit(context, binding.TempLine_MovementType).then(results => {
        if (!libInv.getCheckStockGoodsIssue(context) || (binding.TempHeader_GMCode !== GoodsMovementCode.GoodsIssue) || (results !== 'H')) {
            return Promise.resolve(true);
        }
        const material = binding.TempLine_Material || binding.Material || '';
        const plant = binding.TempLine_Plant || binding.Plant || '';
        const batch = binding.TempLine_Batch || binding.Batch || '';
        const storageLoc = binding.TempLine_StorageLocation || binding.StorageLocation || '';
        const supplier = binding.TempLine_Vendor || binding.Vendor || '';
        const WBSElement = binding.TempLine_WBSElement || binding.WBSElement || '';
        const quantity = Number(binding.TempLine_QuantityInBaseUOM) || '';
        const specialStockInd = binding.TempLine_SpecialStockInd || binding.SpecialStockInd || '';

        return getMaterialDetails(context, material, plant, batch, storageLoc, supplier, WBSElement).then(function(materials) {
            return determineZeroStock(context, specialStockInd, quantity, materials);
        });
    });
}
/* determine Zero stock */
export function determineZeroStock(context, specialStockInd, quantity, results) {
    const materialPlant = results[0];
    const materialSLoc = results[1];
    const materialBatch = results[2];
    const materialVendor = results[3];
    const materialProject = results[4];
    if (specialStockInd === SpecialStock.ConsignmentVendor) {
        if (Number(materialVendor?.UnrestrictedQty) <= quantity) {
            return getWarningMessage(context);
        }
        return Promise.resolve(true);
    } else if (specialStockInd === SpecialStock.ProjectStock) {
        if (Number(materialProject?.UnrestrictedQty) <= quantity) {
            return getWarningMessage(context);
        }
        return Promise.resolve(true);
    } else if (materialPlant?.BatchIndicator || materialPlant?.ValuationCategory) {
        if (Number(materialBatch?.UnrestrictedQuantity) <= quantity) {
            return getWarningMessage(context);
        }
        return Promise.resolve(true);
    } else {
        if (Number(materialSLoc?.UnrestrictedQuantity) <= quantity) {
            return getWarningMessage(context);
        }
        return Promise.resolve(true);
    }
}
/* Display warning message to continue or not in case of zero stock */
export function getWarningMessage(context) {
    const messageText = context.localizeText('zero_stock_warning');
    const captionText = context.localizeText('warning');
    return libCom.showWarningDialog(context, messageText, captionText);
}
/* Get Debit or Credit indicator for movement type */
export function getDebitCredit(context, movementType) {
    let queryOptions = `$filter=MovementType eq '${movementType}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MovementTypes', [], queryOptions).then(function(results) {
        if (!ValidationLibrary.evalIsEmpty(results)) {
            return results.getItem(0).DebitCredit;
        }
        return '';
    });
}

function validationSignatory(context, control) {
    let signatoryValue = control.getValue();
    let controlHasDefinedValue = libCom.isDefined(signatoryValue);
    let signatureWatermark = context.getPageProxy().getControl('FormCellContainer').getControl('SignatureCaptureFormCell').getValue();
    if (signatureWatermark && signatureWatermark.length > 0) {
        if (!controlHasDefinedValue) {
            let message = context.localizeText('validation_signatory_should_not_be_empty');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
    }
    return Promise.resolve(true);
}
