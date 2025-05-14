import libVal from '../../../Common/Library/ValidationLibrary';
import ServiceItemsEDTUpdate from './ServiceItemsEDTUpdate';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function ServiceItemsEDTOnCommit(context) {
    const EDTControl = getEDTControl(context);
    clearValidation(EDTControl);

    let validationResult = [];
    for (const row of EDTControl.getAllValues()) {
        validationResult.push(validateQuantity(context, EDTControl.getRowCellByName(row.RowIndex, 'Quantity'), row.Properties.Quantity));
        validationResult.push(validateUnit(context, EDTControl.getRowCellByName(row.RowIndex, 'Unit'), row.Properties.QuantityUOM));
        validationResult.push(await validateParentItem(context, EDTControl.getRowCellByName(row.RowIndex, 'HigherLvlItem'), row.Properties.HigherLvlItem, row.OdataBinding));
    }

    return validationResult.every(result => result) ?
        ServiceItemsEDTUpdate(context, EDTControl.getUpdatedValues()) :
        Promise.reject();
}

function getEDTControl(context) {
    let sections = context.getControls()[0].getSections();
    return sections[0].getExtension();
}

function clearValidation(edtExtension) {
    const cells = edtExtension.getAllCells();
    cells.forEach(cell => {
        cell.clearValidation();
    });
}

function validateQuantity(context, control, quantity) {
    let message = '';

    if (libVal.evalIsEmpty(quantity)) {
        message = 'field_is_required';
    }

    if (Number(quantity) < 0) {
        message = 'validation_value_greater_than_or_equal_to_zero';
    }

    if (!libVal.evalIsEmpty(message)) {
        control.applyValidation(context.localizeText(message));
        return false;
    }

    return true;
}

function validateUnit(context, control, unit) {
    if (libVal.evalIsEmpty(unit)) {
        control.applyValidation(context.localizeText('field_is_required'));
        return false;
    }

    return true;
}

async function validateParentItem(context, control, parentItemNo, odataBinding) {
    if (libVal.evalIsEmpty(parentItemNo)) {
        return true;
    }

    const message = context.localizeText('invalid_parent_item');
    
    if (odataBinding.ItemNo.includes(parentItemNo)) {
        control.applyValidation(message);
        return false;
    }

    const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems',
        `$filter=ObjectID eq '${odataBinding.ObjectID}' and ItemNo eq '${String(parentItemNo).padStart(6, '0')}'`);

    if (itemsCount === 0) {
        control.applyValidation(message);
        return false;
    }

    return true;
}
