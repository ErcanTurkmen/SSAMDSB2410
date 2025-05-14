import EDTHelper from '../../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTEndMarkerValue(context) {
    let measurements = context.binding.MeasurementDocs;
    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurements);
    let value = EDTHelper.getLAMPropertyValue(context, latestDoc.LAMObjectDatum_Nav, 'EndMarker');

    if (value === undefined) {
        value = EDTHelper.getLAMPropertyValue(context, context.binding.LAMObjectDatum_Nav, 'EndMarker');
    }

    return value || '';
}
