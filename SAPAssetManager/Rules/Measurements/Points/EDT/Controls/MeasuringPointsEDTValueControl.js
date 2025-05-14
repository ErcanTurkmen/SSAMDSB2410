import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTValueControl(context) {
    let binding = context.binding;
    let isReadOnly = !binding.CharName;

    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, binding.MeasurementDocs);
    let readingValue = latestDoc.ReadingValue;
    let parameters = {};
    if (readingValue !== undefined) {
        parameters = { 'Value': readingValue };
    }

    return {
        'Type': 'Number',
        'Name': 'ReadingValue',
        'IsMandatory': false,
        'IsReadOnly': isReadOnly,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTValueControlOnValueChange.js',
        'Property': 'ReadingValue',
        'Parameters': parameters,
    };
}
