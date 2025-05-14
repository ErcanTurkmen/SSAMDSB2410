import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import MeasurementLibrary from '../../Measurements/MeasurementLibrary';
import MeasurementUILibrary from '../../Measurements/MeasurementUILibrary';

export default async function InspectionCharacteristicsLinkedMeasuringPointValidationEDT(context, point, control) {
    
    let isObject = typeof control === 'object' && control !== null && control !== undefined;
    let reading;
    if (isObject) {
        control.clearValidation();
        reading = parseFloat(control.getValue());
    } else {
        reading = control;
    }
    let previousReading = await MeasurementLibrary.getLatestMeasurementPointReading(context, point).then((previousReadingValue) => {
        return previousReadingValue;
    });

    //Run all the error and warning validations
    try {        
        let warningString = MeasurementUILibrary.validateForWarnings(context, point, reading, previousReading);
        if (!ValidationLibrary.evalIsEmpty(warningString)) {
            let warningStringWithNewLines = CommonLibrary.addNewLineAfterSentences(warningString);
            return {'Type' : 'w', 'Message' : warningStringWithNewLines};
        }

        return Promise.resolve();
    } catch (errormessage) {
        if (errormessage) {
            return {'Type' : 'e', 'Message' : errormessage};
        }
        return Promise.reject();
    }
}


