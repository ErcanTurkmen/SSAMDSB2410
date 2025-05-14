import ValidationLibrary from '../Common/Library/ValidationLibrary';
import libThis from './MeasurementLibrary';
import LocalizationLibrary from '../Common/Library/LocalizationLibrary';

export default class {

    static getLatestMeasurementPointReading(context, point) {
        return context.read('/SAPAssetManager/Services/AssetManager.service',`${point['@odata.readLink']}/MeasurementDocs`, [], '$orderby=ReadingTimestamp desc&$top=1').then((measurementDocs) => {
            if (measurementDocs.length > 0) {
                let latestDoc = measurementDocs.getItem(0);
                if (!ValidationLibrary.evalIsEmpty(latestDoc.RecordedValue)) { //just in case the local ones don't have ReadingValue filled
                    return latestDoc.RecordedValue;
                } else {
                    return latestDoc.ReadingValue;
                }
            }

            return '';
        });
    }

    static validateCounterReadingSameAsPrevious(context, point, newReading, previousReading) {
        let validationFailed = false;

        if (!ValidationLibrary.evalIsEmpty(previousReading) && libThis.isCounter(point)) {
            validationFailed = ValidationLibrary.evalAreNumbersEqual(context, newReading, previousReading);
        }

        return validationFailed ? false : true;

    }
    
    /**
     * If this is a counter overflow point, the current reading must be less than the overflow value
     */
    static validateReadingLessThanCounterOverflow(context, point, reading) {
        let isValid = true;

        if (libThis.isCounter(point) && libThis.isCounterOverflow(point) && !ValidationLibrary.evalIsEmpty(point.CounterOverflow)) {
            isValid = ValidationLibrary.isFirstNumberLessThanSecond(context, reading, point.CounterOverflow);
        }
        
        return isValid;
    }

    static isCounter(point) {
        return point.IsCounter === 'X';
    }

    static isCounterOverflow(point) {
        return point.IsCounterOverflow === 'X';
    } 

    /**
     * If this is a reverse counter point and no previous reading exists, the new reading must be <= 0
     */
    static validateContinuousReverseCounterPositiveReading(context, point, newReading, previousReading) {

        let validationFailed = false;

        //Is reverse counter and does not have overflow value and previous reading is empty
        if (libThis.isCounter(point) && libThis.isReverseCounter(point) && !libThis.isCounterOverflow(point) && ValidationLibrary.evalIsEmpty(previousReading)) {
            //New reading <= 0
            validationFailed = LocalizationLibrary.toNumber(context, newReading) > 0;
        }

        return validationFailed ? false : true;
    }

    /**
     * If this is a reverse counter point, the current reading must be <= previous reading
     */
    static validateContinuousReverseCounter(context, point, newReading, previousReading) {

        let validationFailed = false;
        //Reverse counter with no overflow value
        if (libThis.isCounter(point) && libThis.isReverseCounter(point) && !libThis.isCounterOverflow(point) && !ValidationLibrary.evalIsEmpty(previousReading)) {
            //New reading <= previous reading
            validationFailed = ValidationLibrary.isFirstNumberGreaterThanSecond(context, newReading, previousReading);
        }

        return validationFailed ? false : true;
    }

    /**
     * Evaluates whether this point is a reverse counter
     */
    static isReverseCounter(point) {
        return point.IsReverse === 'X';
    }

    /**
     * If this is a non-reverse, non-overflow continuous counter point, the new reading >= 0 if no previous reading
     */
    static validateContinuousCounterReadingNotNegative(context, point, newReading, previousReading) {
        let validationFailed = false;

        //Non-reverse counter with no overflow value and previous reading is empty
        if (libThis.isCounter(point) && !libThis.isReverseCounter(point) && !libThis.isCounterOverflow(point) && ValidationLibrary.evalIsEmpty(previousReading)) {
            validationFailed = LocalizationLibrary.toNumber(context, newReading) < 0;
        }

        return validationFailed ? false : true;
    }

    /**
     * If this is a non-reverse, non-overflow continuous counter point, the new reading >= previous reading
     */
    static validateContinuousCounterReadingGreaterThanOrEqualToPrevious(context, point, newReading, previousReading) {
        let validationFailed = false;

        //Non-reverse counter with no overflow value and previous reading is not empty
        if (libThis.isCounter(point) && !libThis.isReverseCounter(point) && !libThis.isCounterOverflow(point) && !ValidationLibrary.evalIsEmpty(previousReading)) {
            validationFailed = ValidationLibrary.isFirstNumberLessThanSecond(context, newReading, previousReading);
        }

        return validationFailed ? false : true;
    }

    /**
     * If this is a reverse non-overflow counter point, the new reading must be <= 0
     */
    static validateReverseCounterWithoutOverflowIsNotPositive(context, point, reading) {
        let validationFailed = false;

        //Reverse counter with no overflow value
        if (libThis.isCounter(point) && libThis.isReverseCounter(point) && !libThis.isCounterOverflow(point)) {
            //New reading <= 0
            validationFailed = LocalizationLibrary.toNumber(context, reading) > 0;
        }

        return validationFailed ? false : true;
    }

    /**
    * If lower range exists, new reading must be >= lower range
    */
    static validateReadingGreaterThanOrEqualLowerRange(context, point, reading) {

        let validationFailed = false;

        //Lower range value exists and New reading >= lower range
        if (point.IsLowerRange === 'X' && !ValidationLibrary.evalIsEmpty(point.LowerRange)) {
            validationFailed = ValidationLibrary.isFirstNumberLessThanSecond(context, reading, point.LowerRange);
        }

        return validationFailed ? false : true;
    }

    /**
    * If upper range exists, new reading must be <= upper range
    */
    static validateReadingLessThanOrEqualUpperRange(context, point, reading) {

        let validationFailed = false;

        //Upper range value exists and New reading >= lower range
        if (point.IsLowerIsUpperRangeange === 'X' && !ValidationLibrary.evalIsEmpty(point.UpperRange)) {
            validationFailed = ValidationLibrary.isFirstNumberGreaterThanSecond(context, reading, point.UpperRange);
        }

        return validationFailed ? false : true;
    }


    /**
     * If this is a reverse counter point with overflow, the new reading must be >= 0 if no previous reading, or <= previous reading if one exists
     */
    static validateReverseCounterRollover(context, point, newReading, previousReading) {

        let validationFailed = false;

        //Reverse counter with overflow value
        if (libThis.isCounter(point) && libThis.isReverseCounter(point) && libThis.isCounterOverflow(point)) {
            //Previous reading is empty
            if (ValidationLibrary.evalIsEmpty(previousReading)) {
                //New reading >= previous blank reading (zero)
                validationFailed = LocalizationLibrary.toNumber(context, newReading) < 0;
                //Previous reading exists
            } else {
                //Previous reading >= new reading
                validationFailed = ValidationLibrary.isFirstNumberGreaterThanSecond(context, newReading, previousReading);
            }
        }

        return validationFailed ? false : true;
    }

    /**
     * If this is a non-reverse counter point with overflow, the new reading must be >= previous reading
     */
    static validateCounterRolloverWithOverflow(context, point, newReading, previousReading) {

        let validationFailed = false;
        
        //Non-reverse counter with overflow value
        if (libThis.isCounter(point) && !libThis.isReverseCounter(point) && libThis.isCounterOverflow(point)) {
            //Previous reading is not empty
            if (!ValidationLibrary.evalIsEmpty(previousReading)) {
                //New reading >= previous blank reading
                validationFailed = ValidationLibrary.isFirstNumberLessThanSecond(context, newReading, previousReading);
            }
        }
        
        return validationFailed ? false : true;
    }

    /**
     * If this is an overflow counter point, the new reading must be >= 0
     */
    static validateOverflowCounterIsNotNegative(context, point, reading) {

        let validationFailed = false;
        
        //Overflow counter
        if (libThis.isCounter(point) && libThis.isCounterOverflow(point)) {
            //New reading >= 0
            validationFailed = LocalizationLibrary.toNumber(context, reading) < 0;
        }

        return validationFailed ? false : true;
    }

    static validateZeroReading(context, reading) {

        return LocalizationLibrary.toNumber(context, reading) !== 0;
    }

}
