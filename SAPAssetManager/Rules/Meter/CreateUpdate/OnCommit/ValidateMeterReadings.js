import CharacteristicsCountDecimal from '../../../Classification/Characteristics/Validation/CharacteristicsCountDecimal';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default function ValidateMeterReadings(context) {
    let isValid = true;

    let edtTable = CommonLibrary.getControlProxy(context, 'EditableDataTableExtensionSection');
    let edtExtension = edtTable.getExtension();
    if (edtTable.getVisible() && edtExtension && edtExtension.getRows()) {
        clearValidation(edtExtension);

        let allRows = edtExtension.getRows();
        let isSomeReadingEntered = allRows.some(cells => cells.length && cells[1].getValue());
        if (isSomeReadingEntered || context.binding?.FromSingleRegister) {
            for (let rowCells of allRows) {
                if (rowCells.length) {
                    isValid &= validateReading(context, rowCells[1], rowCells[4]);
                    isValid &= validateTime(context, rowCells[2], rowCells[3]);
                }
            }
        }
    }

    return isValid ? Promise.resolve() : Promise.reject();
}

function clearValidation(edtExtension) {
    let cells = edtExtension.getAllCells();
    cells.forEach(cell => {
        cell.clearValidation();
    });
}

function validateReading(context, readingCell, noteCell) {
    let readingValue = readingCell.getValue();
 
    if (!readingValue) {
        let estimateReadingNote = CommonLibrary.getAppParam(context, 'METERREADINGNOTE', 'EstimateMeterReading');
        if (noteCell.getValue() !== estimateReadingNote) {
            readingCell.applyValidation(context.localizeText('field_is_required'));
            return false;
        }
    } else {
        if (!LocalizationLibrary.isNumber(context, readingValue)) {
            readingCell.applyValidation(context.localizeText('validation_reading_is_numeric'));
            return false;
        } else {
            return validateNumericReadingValue(context, readingCell, readingValue);
        }
    }

    return true;
}

function validateNumericReadingValue(context, readingCell, readingValue) {
    let isValid = true;
    let rowBinding = readingCell.getTable().getRowBindings()[readingCell.getRow()];
    let readingValueAsString = String(readingValue);
    let decimalsCount = CharacteristicsCountDecimal(readingValue);
    
    if (decimalsCount > Number(rowBinding.DecimalAfter)) {
        isValid = false;
        readingCell.applyValidation(context.localizeText('max_number_of_decimals', [Number(rowBinding.DecimalAfter)]));
    }

    if (decimalsCount > 0 ? readingValueAsString.length - decimalsCount - 1 < 0 : readingValueAsString.length > Number(rowBinding.DecimalBefore)) {
        isValid = false;
        readingCell.applyValidation(context.localizeText('max_number_of_char', [Number(rowBinding.DecimalBefore)]));
    }

    return isValid;
}

function validateTime(context, peakTimeSwitchCell, peakTimeCell) {
    let isValid = true;
    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(now.getDate() + 1);

    let peakTimeSwitch = peakTimeSwitchCell.getValue();
    let peakTimeValue = peakTimeCell.getValue();
    if (peakTimeSwitch && !peakTimeValue) {
        isValid = false;
        peakTimeCell.applyValidation(context.localizeText('field_is_required'));
    } else if (peakTimeSwitch && new Date(peakTimeValue) >= now) {
        isValid = false;
        peakTimeCell.applyValidation(context.localizeText('validation_peak_reading_time_cannot_be_in_the_future'));
    }

    return isValid;
}

