import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import MeasurementLibrary from '../../Measurements/MeasurementLibrary';
import MeasurementUILibrary from '../../Measurements/MeasurementUILibrary';

export default async function InspectionCharacteristicsLinkedMeasuringPointValidation(context, point, control) {
    
    control.clearValidation();
    let reading = parseFloat(control.getValue());
    let previousReading = await MeasurementLibrary.getLatestMeasurementPointReading(context, point).then((previousReadingValue) => {
        return previousReadingValue;
    });

    //Run all the error and warning validations
    try {        
        let warningString = MeasurementUILibrary.validateForWarnings(context, point, reading, previousReading);
        if (!ValidationLibrary.evalIsEmpty(warningString)) {
            let warningStringWithNewLines = CommonLibrary.addNewLineAfterSentences(warningString);
            CommonLibrary.executeInlineControlWarning(context, control, warningStringWithNewLines);
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    } catch (errormessage) {
        if (errormessage) {
            CommonLibrary.executeInlineControlError(context, control, errormessage);
        }
        return Promise.reject();
    }
}


