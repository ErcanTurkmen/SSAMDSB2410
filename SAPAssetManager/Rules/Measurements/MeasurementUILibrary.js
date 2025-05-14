import MeasurementLibrary from './MeasurementLibrary';
import libThis from './MeasurementUILibrary';

export default class {
    
    static validateForWarnings(context, point, reading, previousReading) {
        let warningString = '';
    
        warningString += libThis.validateZeroReading(context, reading);
        warningString += libThis.validateCounterRolloverWithOverflow(context, point, reading, previousReading);
        warningString += libThis.validateCounterReadingSameAsPrevious(context, point, reading, previousReading);
        warningString += libThis.validateReverseCounterRollover(context, point, reading, previousReading);
        warningString += libThis.validateReadingGreaterThanOrEqualLowerRange(context, point, reading);
        warningString += libThis.validateReadingLessThanOrEqualUpperRange(context, point, reading);

        // former errors, converted to warnings
        warningString += libThis.validateReadingLessThanCounterOverflow(context, point, reading);
        warningString += libThis.validateContinuousReverseCounter(context, point, reading, previousReading);
        warningString += libThis.validateContinuousCounterReadingNotNegative(context, point, reading, previousReading);
        warningString += libThis.validateContinuousCounterReadingGreaterThanOrEqualToPrevious(context, point, reading, previousReading);
        warningString += libThis.validateOverflowCounterIsNotNegative(context, point, reading);
        warningString += libThis.validateReverseCounterWithoutOverflowIsNotPositive(context, point, reading);
    
        return warningString;
    }

    static validateCounterRolloverWithOverflow(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateCounterRolloverWithOverflow(context, point, reading, previousReading);
    
        if (!isValid) {
            let message = context.localizeText('validation_entered_counter_reading_would_cause_a_counter_overflow');
            return message;
        } else {
            return '';
        }
    }
    
    static validateCounterReadingSameAsPrevious(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateCounterReadingSameAsPrevious(context, point, reading, previousReading);
    
        if (!isValid) {
            let message = context.localizeText('validation_counter_reading_is_the_same_as_the_previous_counter_reading');
            return message;
        } else {
            return '';
        }
    }
    
    static validateReverseCounterRollover(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateReverseCounterRollover(context, point, reading, previousReading);
    
        if (!isValid) {
            let message = context.localizeText('validation_reverse_counter_reading_overflow');
            return message;
        } else {
            return '';
        }
    }
    
    static validateReadingGreaterThanOrEqualLowerRange(context, point, reading) {
        let isValid = MeasurementLibrary.validateReadingGreaterThanOrEqualLowerRange(context, point, reading);
    
        if (!isValid) {
            let dynamicParams = [point.LowerRange];
            let message = context.localizeText('validation_reading_below_lower_range_of',dynamicParams);
            return message;
        } else {
            return '';
        }
    }
    
    static validateReadingLessThanOrEqualUpperRange(context, point, reading) {
        let isValid = MeasurementLibrary.validateReadingLessThanOrEqualUpperRange(context, point, reading);
    
        if (!isValid) {
            let dynamicParams = [point.UpperRange];
            let message = context.localizeText('validation_reading_exceeds_upper_range_of',dynamicParams);
            return message;
        } else {
            return '';
        }
    }
    
    static validateZeroReading(context, reading) {
        let isValid = MeasurementLibrary.validateZeroReading(context, reading);
    
        if (!isValid) {
            let message = context.localizeText('validation_zero_reading_entered');
            return message;
        } else {
            return '';
        }
    }
    
    static validateReadingLessThanCounterOverflow(context, point, reading) {
        let isValid = MeasurementLibrary.validateReadingLessThanCounterOverflow(context, point, reading);
    
        if (!isValid) {
            let dynamicParams = [point.CounterOverflow];
            let message = context.localizeText('validation_reading_less_than_counter_overflow',dynamicParams);
            return message;
        } else {
            return '';
        }
    }
    
    static validateContinuousReverseCounter(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateContinuousReverseCounter(context, point, reading, previousReading);
    
        if (!isValid) {
            let dynamicParams = [previousReading];
            let message = context.localizeText('validation_reading_must_be_less_than_or_equal_to_previous_reverse_counter_reading_of', dynamicParams);
            return message;
        } else {
            return '';
        }
    }
    
    static validateContinuousCounterReadingNotNegative(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateContinuousCounterReadingNotNegative(context, point, reading, previousReading);
        
        if (!isValid) {
            let message = context.localizeText('validation_reading_greater_than_or_equal_toZero');
            return message;
        } else {
            return '';
        }
    }
    
    static validateContinuousCounterReadingGreaterThanOrEqualToPrevious(context, point, reading, previousReading) {
        let isValid = MeasurementLibrary.validateContinuousCounterReadingGreaterThanOrEqualToPrevious(context, point, reading, previousReading);
    
        if (!isValid) {
            let dynamicParams = [previousReading];
            let message = context.localizeText('validation_reading_greater_than_or_equal_to_previous_counter_reading', dynamicParams);
            return message;
        } else {
            return '';
        }
    }
    
    static validateOverflowCounterIsNotNegative(context, point, reading) {
        let isValid = MeasurementLibrary.validateOverflowCounterIsNotNegative(context, point, reading);
        
        if (!isValid) {
            let message = context.localizeText('validation_overflow_counter_reading_must_be_greater_than_or_equal_toZero');
            return message;
        } else {
            return '';
        }
    }
    
    static validateReverseCounterWithoutOverflowIsNotPositive(context, point, reading) {
        let isValid = MeasurementLibrary.validateReverseCounterWithoutOverflowIsNotPositive(context, point, reading);
    
        if (!isValid) {
            let message = context.localizeText('validation_reverse_counter_reading_must_be_less_than_or_equal_toZero');
            return message;
        } else {
            return '';
        }
    }
}
