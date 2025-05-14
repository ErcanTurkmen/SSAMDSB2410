import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';
import MeasuringPointLibrary from '../../MeasuringPointLibrary';
import MeasuringPointsEDTErrorHandler from './MeasuringPointsEDTErrorHandler';
import EDTHelper from './MeasuringPointsEDTHelper';
import MeasuringPointsEDTOnCommit from './MeasuringPointsEDTOnCommit';

export default function MeasuringPointsEDTOnSave(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();

    let ErrorsHandler = new MeasuringPointsEDTErrorHandler();
    ErrorsHandler.hideErrors(sections);
    CommonLibrary.setStateVariable(context, 'MissingCount', 0);

    validateEDTSections(context, ErrorsHandler);
    ErrorsHandler.showWarnings(sections, context);
    if (ErrorsHandler.hasErrors()) {
        ErrorsHandler.showErrors(sections);
        return Promise.reject();
    } else {
        const count = CommonLibrary.getStateVariable(context, 'MissingCount');

        if (count > 0) {
            const messageText = context.localizeText('validation_missed_readings_x', [count]);
            const okButtonText = context.localizeText('continue_text');

            return CommonLibrary.showWarningDialog(context, messageText, undefined, okButtonText).then(() => {
                return MeasuringPointsEDTOnCommit(context);
            });
        }
        return MeasuringPointsEDTOnCommit(context);
    }
}

function validateEDTSections(context, ErrorsHandler) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let edtSectionIndex = 0;

    for (let section of sections) {
        if (section._context.element.definition._data.Class === 'EditableDataTableViewExtension') {
            ErrorsHandler.setSectionIndex(edtSectionIndex);

            let validated = validateEDTSection(context, section, edtSectionIndex, ErrorsHandler);
            if (!validated) {
                Logger.info(`Section ${edtSectionIndex} was not validated`);
            }

            edtSectionIndex++;
        }
    }
}

function validateEDTSection(context, section, sectionIndex, ErrorsHandler) {
    let sectionExtension = section.getExtension();
    if (!sectionExtension) {
        return false;
    }
    
    const values = sectionExtension.getValues();
    sectionExtension.getRowBindings().forEach((rowBinding, rowIndex) => {
        ErrorsHandler.setRowIndex(rowIndex);

        let isValid = true;
        let cachedRowBinding = EDTHelper.getCachedRowBinding(context, sectionIndex, rowBinding);
        let measurementDoc = EDTHelper.getLatestMeasurementDoc(context, cachedRowBinding);
        let valuesForRow = values.find(value => value.RowIndex === rowIndex);
        
        if (!measurementDoc._skipped) {
            if (!shouldSkipEmptyReading(context, valuesForRow.Properties)) {
                measurementDoc._updated = true; 
                isValid &= validateReadingValue(context, measurementDoc, rowBinding, ErrorsHandler);
                isValid &= validateValuationCodeEntered(context, measurementDoc, rowBinding, ErrorsHandler);
                isValid &= validateShortTextExceedsLength(context, measurementDoc, ErrorsHandler);
    
                if (cachedRowBinding.PointType === 'L') {
                    isValid &= validateLAM(context, measurementDoc, ErrorsHandler);
                }
            }
        }

        measurementDoc._error = !isValid;
    });

    return true;
}

export function validateReadingValue(context, measurementDoc, rowBinding, ErrorsHandler) {
    let isValid = true;

    const isReadingValidationNeeded = EDTHelper.isReadingValueMandatory(rowBinding, measurementDoc);
    if (isReadingValidationNeeded) {
        isValid &= validateReadingExceedsLength(context, measurementDoc, ErrorsHandler);
        isValid &= validatePrecisionWithinLimit(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateReadingLessThanCounterOverflow(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateContinuousReverseCounter(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateContinuousCounter(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateOverflowCounterIsNotNegative(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateReverseCounterWithoutOverflowIsNotPositive(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateReadingGreaterThanOrEqualLowerRange(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateReadingLessThanOrEqualUpperRange(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateReverseCounterRollover(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateCounterReadingEqualToPreviousReading(context, measurementDoc, rowBinding, ErrorsHandler);
        isValid &= validateCounterRolloverWithOverflow(context, measurementDoc, rowBinding, ErrorsHandler);
    }

    return isValid;
}

// check if this row was not touched at all and increment missing count to show empty readings warning later
function shouldSkipEmptyReading(context, valuesForRow) {
    if (ValidationLibrary.evalIsEmpty(valuesForRow.ValuationCode) && ValidationLibrary.evalIsEmpty(valuesForRow.ReadingValue)) {
        let missingCount = CommonLibrary.getStateVariable(context, 'MissingCount');
        CommonLibrary.setStateVariable(context, 'MissingCount', missingCount + 1); //Increment missing counter
        return true;
    }
    
    return false;
}

// New reading must be <= length limit defined in global
function validateReadingExceedsLength(context, measurementDoc, ErrorsHandler) {
    let value = measurementDoc.ReadingValue ? Number(measurementDoc.ReadingValue).toString() : '';
    let limit = CommonLibrary.getAppParam(context, 'MEASURINGPOINT', 'ReadingLength');

    let isValid = value.length <= Number(limit) && !value.includes('e');

    if (!isValid) {
        let message = context.localizeText('validation_maximum_field_length', [limit]);
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
    }

    return isValid;
}

// New short text must be <= length limit defined in global
export function validateShortTextExceedsLength(context, measurementDoc, ErrorsHandler) {
    let value = measurementDoc.ShortText || '';
    let limit = CommonLibrary.getAppParam(context, 'MEASURINGPOINT', 'ShortTextLength');

    let isValid = value.length <= Number(limit);

    if (!isValid) {
        let message = context.localizeText('validation_maximum_field_length', [limit]);
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ShortTextNote'), message);
    }

    return isValid;
}

// Valuation code must be selected if code group is not blank and either
// (characteristic is blank) or (characteristic is not blank and code sufficient is set and reading is blank)
export function validateValuationCodeEntered(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.CodeGroup) {
        if (measurementPoint.CharName) {
            if (measurementPoint.IsCodeSufficient === 'X' && !measurementDoc.ReadingValue) {
                isValid = !!measurementDoc.ValuationCode;

                if (!isValid) {
                    let message = context.localizeText('validation_valuation_code_or_reading_must_be_selected');
                    ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ValuationCode'), message);
                }
            }
        } else {
            isValid = !!measurementDoc.ValuationCode;

            if (!isValid) {
                let message = context.localizeText('field_is_required');
                ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ValuationCode'), message);
            }
        }
    }

    return isValid;
}

// New reading decimal precision must be within limits
function validatePrecisionWithinLimit(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.Decimal === 0) {
        isValid = isInt(measurementDoc.ReadingValue);

        if (!isValid) {
            let message = context.localizeText('validation_reading_must_be_an_integer_without_decimal_precision');
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    } else if (measurementPoint.Decimal) {
        isValid = MeasuringPointLibrary.evalPrecision(measurementDoc.ReadingValue) <= measurementPoint.Decimal;

        if (!isValid) {
            let message = context.localizeText('validation_reading_within_decimal_precision_of', [measurementPoint.Decimal]);
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    }

    return isValid;
}

function isInt(value) {
    return Number(value) === value && value % 1 === 0;
}

// If this is a counter overflow point, the current reading must be less than the overflow value
function validateReadingLessThanCounterOverflow(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsCounterOverflow === 'X') {
        isValid = measurementDoc.ReadingValue < measurementPoint.CounterOverflow;
    }

    if (!isValid) {
        let message = context.localizeText('validation_reading_less_than_counter_overflow_banner_message', [measurementPoint.CounterOverflow]);
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
    }

    return isValid;
}

// If this is a reverse counter point, the previous reading must be >= current reading
// If this is a reverse counter point and no previous reading exists, the new reading must be <= 0
function validateContinuousReverseCounter(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsReverse === 'X' && measurementPoint.IsCounterOverflow === '') {
        if (measurementDoc.PrevReadingValue) {
            isValid = measurementDoc.PrevReadingValue >= measurementDoc.ReadingValue;

            if (!isValid) {
                let message = context.localizeText('validation_reading_must_be_less_than_or_equal_to_previous_reverse_counter_reading_of', [measurementDoc.PrevReadingValue]);
                ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
            }
        } else {
            isValid = measurementDoc.ReadingValue <= 0;

            if (!isValid) {
                let message = context.localizeText('validation_reverse_counter_reading_must_be_less_than_or_equal_toZero');
                ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
            }
        }
    }

    return isValid;
}

// If this is a non-reverse, non-overflow continuous counter point, the new reading must be >= previous reading, or >= 0 if no previous reading
function validateContinuousCounter(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsReverse === '' && measurementPoint.IsCounterOverflow === '') {
        if (measurementDoc.PrevReadingValue) {
            isValid = measurementDoc.ReadingValue >= measurementDoc.PrevReadingValue;

            if (!isValid) {
                let message = context.localizeText('validation_reading_greater_than_or_equal_to_previous_counter_reading', [measurementDoc.PrevReadingValue]);
                ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
            }
        } else {
            isValid = measurementDoc.ReadingValue >= 0;

            if (!isValid) {
                let message = context.localizeText('validation_reading_greater_than_or_equal_toZero');
                ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
            }
        }
    }

    return isValid;
}

//If this is an overflow counter point, the new reading must be >= 0
function validateOverflowCounterIsNotNegative(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsCounterOverflow === 'X') {
        isValid = measurementDoc.ReadingValue >= 0;

        if (!isValid) {
            let message = context.localizeText('validation_overflow_counter_reading_must_be_greater_than_or_equal_toZero');
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    }

    return isValid;
}

// If this is a reverse non-overflow counter point, the new reading must be <= 0
function validateReverseCounterWithoutOverflowIsNotPositive(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsReverse === 'X' && measurementPoint.IsCounterOverflow === '') {
        isValid = measurementDoc.ReadingValue <= 0;

        if (!isValid) {
            let message = context.localizeText('validation_reverse_counter_reading_must_be_less_than_or_equal_toZero');
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    }

    return isValid;
}

// If lower range exists, new reading must be >= lower range
function validateReadingGreaterThanOrEqualLowerRange(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsLowerRange === 'X' && measurementPoint.LowerRange) {
        isValid = measurementDoc.ReadingValue >= measurementPoint.LowerRange;

        if (!isValid) {
            let message = context.localizeText('validation_reading_below_lower_range_of', [measurementPoint.LowerRange]);
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    }

    return isValid;
}

// If upper range exists, new reading must be <= upper range
function validateReadingLessThanOrEqualUpperRange(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsUpperRange === 'X' && measurementPoint.UpperRange) {
        isValid = measurementDoc.ReadingValue <= measurementPoint.UpperRange;

        if (!isValid) {
            let message = context.localizeText('validation_reading_exceeds_upper_range_of', [measurementPoint.UpperRange]);
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
        }
    }

    return isValid;
}

// If this is a reverse counter point with overflow, the new reading must be >= 0 if no previous reading, or <= previous reading if one exists
function validateReverseCounterRollover(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementPoint.IsCounter === 'X' && measurementPoint.IsReverse === 'X' && measurementPoint.IsCounterOverflow === 'X') {
        if (measurementDoc.PrevReadingValue) {
            isValid = measurementDoc.ReadingValue <= measurementDoc.PrevReadingValue;
        } else {
            isValid = measurementDoc.ReadingValue >= 0;
        }
    }

    if (!isValid) {
        let message = context.localizeText('validation_reverse_counter_reading_overflow');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('ReadingValue'), message);
    }

    return isValid;
}

// If this is a counter point, the new reading should not equal the previous   
function validateCounterReadingEqualToPreviousReading(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementDoc.PrevReadingValue && measurementPoint.IsCounter === 'X') {
        isValid = measurementDoc.PrevReadingValue !== measurementDoc.ReadingValue;
    }

    if (!isValid) {
        let message = context.localizeText('validation_counter_reading_is_the_same_as_the_previous_counter_reading');
        ErrorsHandler.addWarningMessage(ErrorsHandler.generateKey('ReadingValue'), message);
    }

    return isValid;
}

// If this is a non-reverse counter point with overflow, the new reading must be >= previous reading
function validateCounterRolloverWithOverflow(context, measurementDoc, measurementPoint, ErrorsHandler) {
    let isValid = true;

    if (measurementDoc.PrevReadingValue && measurementPoint.IsCounter === 'X' && measurementPoint.IsReverse === '' && measurementPoint.IsCounterOverflow === 'X') {
        isValid = measurementDoc.ReadingValue >= measurementDoc.PrevReadingValue;
    }

    if (!isValid) {
        let message = context.localizeText('validation_entered_counter_reading_would_cause_a_counter_overflow');
        ErrorsHandler.addWarningMessage(ErrorsHandler.generateKey('ReadingValue'), message);
    }

    return true;
}

export function validateLAM(context, measurementDoc, ErrorsHandler) {
    if (!measurementDoc.LAMObjectDatum_Nav) return false;

    let isValid = true;
    if (measurementDoc.LAMObjectDatum_Nav.Length <= 0) {
        isValid = false;
        let message = context.localizeText('positive_length');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('Length'), message);
    }

    if (measurementDoc.LAMObjectDatum_Nav.Offset1Type && measurementDoc.LAMObjectDatum_Nav.Offset2Type) {
        if (measurementDoc.LAMObjectDatum_Nav.Offset1Type === measurementDoc.LAMObjectDatum_Nav.Offset2Type) {
            isValid = false;
            let message = context.localizeText('validation_offsets_types_are_same');
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('Offset1Type'), message);
            ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('Offset2Type'), message);
        }
    }

    if (!measurementDoc.LAMObjectDatum_Nav.UOM) {
        isValid = false;
        let message = context.localizeText('field_is_required');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('UOM'), message);
    }

    if (!measurementDoc.LAMObjectDatum_Nav.MarkerUOM) {
        isValid = false;
        let message = context.localizeText('field_is_required');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('MarkerUOM'), message);
    }

    if (measurementDoc.LAMObjectDatum_Nav.Offset1Value && !measurementDoc.LAMObjectDatum_Nav.Offset1Type) {
        isValid = false;
        let message = context.localizeText('field_is_required');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('Offset1Type'), message);
    }

    if (measurementDoc.LAMObjectDatum_Nav.Offset2Value && !measurementDoc.LAMObjectDatum_Nav.Offset2Type) {
        isValid = false;
        let message = context.localizeText('field_is_required');
        ErrorsHandler.addErrorMessage(ErrorsHandler.generateKey('Offset2Type'), message);
    }

    return isValid;
}
