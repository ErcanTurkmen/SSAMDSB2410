import EDTHelper from '../../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOffset1UOMValue(context) {
    let measurements = context.binding.MeasurementDocs;
    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurements);
    let value = EDTHelper.getLAMPropertyValue(context, latestDoc.LAMObjectDatum_Nav, 'Offset1UOM');

    if (value === undefined) {
        value = EDTHelper.getLAMPropertyValue(context, context.binding.LAMObjectDatum_Nav, 'Offset1UOM');
    }

    return value || '';
}
