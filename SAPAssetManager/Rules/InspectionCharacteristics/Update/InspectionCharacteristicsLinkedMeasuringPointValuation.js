import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import MeasurementLibrary from '../../Measurements/MeasurementLibrary';
import MeasurementUILibrary from '../../Measurements/MeasurementUILibrary';

export default async function InspectionCharacteristicsLinkedMeasuringPointValuation(context, point, reading) {
    let previousReading = await MeasurementLibrary.getLatestMeasurementPointReading(context, point).then((previousReadingValue) => {
        return previousReadingValue;
    });

    //Run all the warning validations
    try {        
        let warningString = MeasurementUILibrary.validateForWarnings(context, point, reading, previousReading);
        if (!ValidationLibrary.evalIsEmpty(warningString)) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    } catch (error) {
        Logger.error(`Inspection Char linked measuring point validation error: ${error}`);
        return Promise.reject();
    }
}


