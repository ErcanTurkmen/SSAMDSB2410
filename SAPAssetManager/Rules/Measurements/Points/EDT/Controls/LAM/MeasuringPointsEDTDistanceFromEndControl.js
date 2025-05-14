import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTDistanceFromEndControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'EndMarkerDistance');

    if (!parameters.Value) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'EndMarkerDistance');
    }

    return {
        'Type': 'Number',
        'Name': 'EndMarkerDistance',
        'IsMandatory': false,
        'IsReadOnly': false,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/EndMarkerDistance',
        'Parameters': parameters,
    };
}
