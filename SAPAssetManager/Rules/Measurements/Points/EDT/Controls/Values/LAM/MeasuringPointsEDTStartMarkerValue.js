import EDTHelper from '../../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTStartMarkerValue(context) {
    let measurements = context.binding.MeasurementDocs;
    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurements);
    let value = EDTHelper.getLAMPropertyValue(context, latestDoc.LAMObjectDatum_Nav, 'StartMarker');

    if (value === undefined) {
        value = EDTHelper.getLAMPropertyValue(context, context.binding.LAMObjectDatum_Nav, 'StartMarker');
    }

    return value || '';
}
