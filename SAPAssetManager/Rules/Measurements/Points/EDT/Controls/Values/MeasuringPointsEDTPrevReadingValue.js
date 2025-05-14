import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTPrevReadingValue(context) {
    let binding = context.binding;
    let latestDoc = EDTHelper.getLatestMeasurementDoc(context, binding);
    return latestDoc.ReadingValue ? String(latestDoc.ReadingValue) : '-';
}
