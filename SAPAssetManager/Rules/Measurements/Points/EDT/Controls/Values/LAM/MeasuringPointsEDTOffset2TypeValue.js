import EDTHelper from '../../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOffset2TypeValue(context) {
    let measurements = context.binding.MeasurementDocs;
    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurements);
    let value = EDTHelper.getLAMPropertyValue(context, latestDoc.LAMObjectDatum_Nav, 'Offset2Type');

    if (value === undefined) {
        value = EDTHelper.getLAMPropertyValue(context, context.binding.LAMObjectDatum_Nav, 'Offset2Type');
    }

    return value || '';
}
