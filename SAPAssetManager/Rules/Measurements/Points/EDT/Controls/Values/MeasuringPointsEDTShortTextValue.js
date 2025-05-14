import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTShortTextValue(context) {
    let latestDoc = EDTHelper.getLatestMeasurementDoc(context, context.binding);
    return latestDoc.ShortText;
}
